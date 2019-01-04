/**
 * @module api:contract:contract-get
 */

const _     = require("lodash");
const pg    = require("../../services/pg");

const handler_get_contract = async (request, response) => {
    const result = await pg.query(`
        SELECT      con.name                AS contract_id,
                    cus.public_id           AS customer_id,
                    par.public_id           AS served_by,
                    con.area_code,
                    con.schedule,
                    con.price,
                    con.start
        FROM        app.contract    con
        JOIN        app.customer    cus     ON cus.id = con.customer
        JOIN        app.partner     par     ON par.id = con.served_by
        WHERE       con.name                = $1
    `, [request.params.name]);

    response.json(_.first(result) || { error: "not_found" });
};

module.exports = api => api.route("/contract/:name/").get(handler_get_contract);
