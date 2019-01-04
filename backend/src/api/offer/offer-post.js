/**
 * @module api:offer:offer-post
 */

const _             = require("lodash");
const config        = require("../../config");
const price_tool    = require("../../services/price-tool");
const pg            = require("../../services/pg");
const tx            = require("../../services/tx");

/**
 * Create a new random contract name.
 *
 * @return  {String}    - New contract name as a string formatted `C-XXXXX`
 */
const create_contract_name = () => `C-${_.times(5, () => _.random(35).toString(36).toUpperCase()).join("")}`;

const handler_post_offer = async (request, response) => {
    try {
        const { partner_id }    = request.params;
        const { customer_id }   = request.body;
        console.log(`[api:offer:offer-post:handler_post_offer][info] - Accepting offer - customer: ${customer_id} - partner: ${partner_id} - request params: ${JSON.stringify(request.params)} - request body: ${JSON.stringify(request.body)}`);

        if (!partner_id || !customer_id) {
            console.log(`[api:offer:offer-post:handler_post_offer][error] - Missing one or more parameters - customer: ${customer_id} - partner: ${partner_id} - request params: ${JSON.stringify(request.params)} - request body: ${JSON.stringify(request.body)}`);
            return response.status(400).json({ error: "missing_parameters" });
        }

        //-- Get partner object, must be active --
        const partner = _.first(await pg.query(`
            SELECT      *
            FROM        app.partner
            WHERE       public_id           = $1
            AND         status              = 'active'
        `, [partner_id]));

        if (!partner) {
            console.log(`[api:offer:offer-post:handler_post_offer][warning] - Partner not available - customer: ${customer_id} - partner: ${partner_id} - partner data: ${JSON.stringify(partner)}`);
            return response.status(400).json({ error: "partner_not_available" });
        }

        //-- Get customer object, must be b2b. same area as partner, and not yet served by a partner --
        const customer = _.first(await pg.query(`
            SELECT      *
            FROM        app.customer
            WHERE       public_id           = $1
            AND         customer_type       = 'b2b'
            AND         address_country     = $2
            AND         area_code           = $3
            AND         area_code           IS NOT NULL
            AND         served_by           IS NULL
        `, [customer_id, partner.address_country, partner.area_code]));

        if (!customer) {
            console.log(`[api:offer:offer-post:handler_post_offer][warning] - Customer not servable - customer: ${customer_id} - partner: ${partner_id} - customer data: ${JSON.stringify(customer)} - partner data: ${JSON.stringify(partner)}`);
            return response.status(409).json({ error: "customer_not_servable" });
        }

        const contract_name     = create_contract_name();
        const contract_price    = await price_tool.get_offer_price({ area_code: customer.area_code, customer_id });
        console.log(`[api:offer:offer-post:handler_post_offer][info] - Creating contract - customer: ${customer_id} - partner: ${partner_id} - contract: ${contract_name} - contract price: ${contract_price} - customer data: ${JSON.stringify(customer)} - partner data: ${JSON.stringify(partner)}`);

        //-- Execute transactions --
        const result = await Promise.all([

            //-- Send partner email --
            tx.send({
                path    : "email:send",
                source  : "backend:api:offer:offer-post:handler_post_offer",
                data    : {
                    sender      : config.email.from,
                    recipient   : partner.email,
                    subject     : "Offer accepted",
                    text        : `The offer was accepted with contract id ${contract_name}.`,
                },
            }),

            //-- Send customer email --
            tx.send({
                path    : "email:send",
                source  : "backend:api:offer:offer-post:handler_post_offer",
                data    : {
                    sender      : config.email.from,
                    recipient   : customer.email,
                    subject     : "We are happy to welcome you as our customer!",
                    text        : `Please log in to see your new contract ${contract_name}.`,
                },
            }),

            //-- Update customer to be served by partner --
            pg.query(`
                UPDATE      app.customer
                SET         served_by           = $2,
                            updated             = CURRENT_TIMESTAMP
                WHERE       id                  = $1
                AND         served_by           IS NULL
            `, [
                customer.id,
                partner.id,
            ]),

            //-- Create contract object --
            pg.query(`
                INSERT INTO app.contract
                    (created, updated, name, customer, served_by, area_code, schedule, price, start)
                VALUES
                    (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $1, $2, $3, $4, $5, $6, CURRENT_DATE)
                RETURNING *
            `, [
                contract_name,
                customer.id,
                partner.id,
                customer.area_code,
                JSON.stringify(customer.schedule || {}),
                contract_price,
            ]),
        ]);

        //-- Endpoint response --
        console.log(`[api:offer:offer-post:handler_post_offer][info] - Offer accepted and contract created - customer: ${customer_id} - partner: ${partner_id} - contract: ${contract_name} - result: ${JSON.stringify(result)}`);
        return response.json({
            status              : "accepted",
            partner_id,
            customer_id,
            customer_name       : customer.name,
            customer_company    : customer.company_name,
            address_street      : customer.address_street,
            address_city        : customer.address_city,
            address_postalcode  : customer.address_postalcode,
            schedule            : customer.schedule,
            contract_price      : +_.get(result, "[3][0].price"),
            contract_name       : _.get(result, "[3][0].name"),
            contract_start      : _.get(result, "[3][0].start"),
        });
    } catch (error) {
        console.log(`[api:offer:offer-post:handler_post_offer][error] - Failed to accept offer - error: ${JSON.stringify(error)} - request params: ${JSON.stringify(request.params)} - request body: ${JSON.stringify(request.body)} - stack: ${(error || {}).stack}`);
        return response.status(500).json({ error: "server_error" });
    }
};

module.exports = api => api.route("/offer/:partner_id/").post(handler_post_offer);
