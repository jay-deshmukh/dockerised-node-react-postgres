/**
 * @module api:offer:offer-get
 */

const _             = require("lodash");
const price_tool    = require("../../services/price-tool");
const pg            = require("../../services/pg");


//-- adds contract data (name , price , start) if contract is active
const addContractData = async (offer, partner_id) => {
    const updatedOffer = offer;
    const contract = _.first(await pg.query(`
    SELECT  name , price , start 
    FROM    app.contract
    WHERE   customer  =   ${offer.id}
    AND     served_by =   ${partner_id}
  `));
    updatedOffer.contract_name = contract.name;
    updatedOffer.contract_price = contract.price;
    updatedOffer.contract_start = contract.start;
    return updatedOffer;
};

const handler_get_offer = async (request, response) => {
    try {
        const { partner_id }    = request.params;

        if (!partner_id) {
            console.log(`[api:offer:offer-get:handler_get_offer][error] - Missing parameter  - partner: ${partner_id} - request params: ${JSON.stringify(request.params)} - request body: ${JSON.stringify(request.body)}`);
            return response.status(400).json({ error: "missing_parameters" });
        }

        //-- Get Partner object
        const partner = _.first(await pg.query(`
        SELECT      *
        FROM        app.partner
        WHERE       public_id           = '${partner_id}'
      `));

        if (!partner) {
            console.log(`[api:offer:offer-get:handler_get_offer][warning] - Partner not available - partner: ${partner_id} - partner data: ${JSON.stringify(partner)}`);
            return response.status(400).json({ error: "partner_not_available / partner in-active" });
        }

        //-- Get Offers of b2b customers with same area as active partner
        const offers = await pg.query(`
      SELECT  cus.id                  AS        id,
              par.public_id           AS        partner_id,
              cus.public_id           AS        customer_id,
              cus.name                AS        customer_name,
              cus.company_name        AS        customer_company,
              cus.address_street      AS        customer_street,
              cus.address_city        AS        address_city,
              cus.address_postalcode  AS        address_postalcode,
              cus.schedule            AS        schedule,
              cus.area_code           AS        area_code,
              cus.served_by           AS        served_by
      FROM    app.partner             AS        par
      INNER JOIN app.customer         AS        cus 
      ON      cus.area_code           =         '${partner.area_code}'
      AND     par.status              =         'active'
      AND     cus.customer_type       =         'b2b'
      AND     par.id                  =          ${partner.id}
      `);

        for (let i = 0; i < offers.length; i += 1) {
        // schedule_matches = _.match // TODO :: Match two objects (BONUS!)
            offers[i].contract_price = await price_tool.get_offer_price({ area_code: offers[i].area_code, customer_id : offers[i].id });
            if (offers[i].served_by === null) {
                offers[i].status = "new";
                offers[i] = _.omit(offers[i], "id", "served_by", "area_code");
            } else if (offers[i].served_by === partner.id) {
                offers[i].status = "active";
                offers[i] = await addContractData(offers[i], partner.id);
                offers[i] = _.omit(offers[i], "id", "served_by", "area_code");
            }
        }

        //-- Endpoint Response --
        console.log(`[api:offer:offer-get:handler_get_offer][info] - Offers for partner: ${partner_id} returned`);
        return response.status(200).json({ offers });
    } catch (error) {
        console.log(`[api:offer:offer-get:handler_get_offer][error] - Failed to fetch offers - error: ${JSON.stringify(error)} - request params: ${JSON.stringify(request.params)} - request body: ${JSON.stringify(request.body)} - stack: ${(error || {}).stack}`);
        return response.status(500).json({ error: "server_error" });
    }
};

module.exports = api => api.route("/offer/:partner_id/").get(handler_get_offer);
