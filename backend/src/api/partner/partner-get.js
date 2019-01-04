/**
 * @module api:partner:partner-get
 */

const _     = require("lodash");
const pg    = require("../../services/pg");

const handler_get_partner = async (request, response) => {
    const result = await pg.query(`
        SELECT      public_id               AS partner_id,
                    company_name,
                    contact_name,
                    status,
                    email,
                    phone,
                    address_street,
                    address_city,
                    address_postalcode,
                    address_country,
                    area_code,
                    working_schedule
        FROM        app.partner
        WHERE       public_id               = $1
    `, [request.params.public_id]);

    response.json(_.first(result) || { error: "not_found" });
};

module.exports = api => api.route("/partner/:public_id/").get(handler_get_partner);
