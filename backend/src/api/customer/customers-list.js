/**
 * @module api:customer:customers-list
 */

const pg = require("../../services/pg");

const handler_list_customers = async (request, response) => {
    const customers = await pg.query(`
        SELECT      cus.public_id           AS customer_id,
                    cus.name,
                    cus.company_name,
                    cus.customer_type,
                    cus.email,
                    cus.phone,
                    cus.area_code,
                    par.public_id           AS served_by,
                    con.name                AS contract
        FROM        app.customer    cus
        LEFT JOIN   app.partner     par     ON  par.id = cus.served_by
        LEFT JOIN   app.contract    con     ON  con.customer    = cus.id
                                            AND con.served_by   = cus.served_by
        ORDER BY    cus.name        ASC,
                    cus.public_id   ASC
    `);

    response.json({ customers });
};

module.exports = api => api.route("/customer/").get(handler_list_customers);
