/**
 * @module api:partner:partner-list
 */

const pg = require("../../services/pg");

const handler_list_partners = async (request, response) => {
    const partners = await pg.query(`
        SELECT      public_id               AS partner_id,
                    company_name,
                    contact_name,
                    status,
                    email,
                    phone,
                    area_code
        FROM        app.partner
        WHERE       status                  = 'active'
        ORDER BY    company_name    ASC,
                    public_id       ASC
    `);

    response.json({ partners });
};

module.exports = api => api.route("/partner/").get(handler_list_partners);
