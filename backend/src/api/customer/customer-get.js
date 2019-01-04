/**
 * @module api:customer:customer-get
 */

const _     = require("lodash");
const pg    = require("../../services/pg");

const handler_get_customer = async (request, response) => {
    const result = await pg.query(`
        SELECT      cus.public_id           AS customer_id,
                    cus.name,
                    cus.company_name,
                    cus.customer_type,
                    cus.email,
                    cus.phone,
                    cus.address_street,
                    cus.address_city,
                    cus.address_postalcode,
                    cus.address_country,
                    cus.area_code,
                    cus.schedule,
                    par.public_id           AS served_by,
                    con.name                AS contract_id
        FROM        app.customer    cus
        LEFT JOIN   app.partner     par     ON  par.id = cus.served_by
        LEFT JOIN   app.contract    con     ON  con.customer    = cus.id
                                            AND con.served_by   = cus.served_by
        WHERE       cus.public_id           = $1
    `, [request.params.public_id]);

    response.json(_.first(result) || { error: "not_found" });
};

module.exports = api => api.route("/customer/:public_id/").get(handler_get_customer);
