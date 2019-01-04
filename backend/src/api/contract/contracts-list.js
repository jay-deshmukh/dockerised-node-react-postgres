/**
 * @module api:contract:contracts-list
 */

const pg = require("../../services/pg");

const handler_list_contracts = async (request, response) => {
    const contracts = await pg.query(`
        SELECT      con.name                AS contract_id,
                    cus.public_id           AS customer_id,
                    par.public_id           AS served_by,
                    con.area_code
        FROM        app.contract    con
        JOIN        app.customer    cus     ON cus.id = con.customer
        JOIN        app.partner     par     ON par.id = con.served_by
        ORDER BY    con.name        ASC
    `);

    response.json({ contracts });
};

module.exports = api => api.route("/contract/").get(handler_list_contracts);
