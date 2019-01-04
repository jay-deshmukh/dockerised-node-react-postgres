/**
 * @module api:area:areas-list
 */

const pg = require("../../services/pg");

const handler_list_areas = async (request, response) => {
    const areas = await pg.query(`
        WITH

            customer_areas AS (
                SELECT      area_code,
                            COUNT(*)        AS count
                FROM        app.customer
                GROUP BY    area_code
            ),

            partner_areas AS (
                SELECT      area_code,
                            COUNT(*)        AS count
                FROM        app.partner
                GROUP BY    area_code
            ),

            contract_areas AS (
                SELECT      area_code,
                            COUNT(*)        AS count
                FROM        app.contract
                GROUP BY    area_code
            )

        SELECT      cus.area_code,
                    cus.count               AS customer_count,
                    par.count               AS partner_count,
                    con.count               AS contract_count
        FROM        customer_areas  cus
        LEFT JOIN   partner_areas   par     ON par.area_code = cus.area_code
        LEFT JOIN   contract_areas  con     ON con.area_code = cus.area_code
        ORDER BY    cus.area_code           ASC
    `);

    response.json({ areas });
};

module.exports = api => api.route("/area/").get(handler_list_areas);
