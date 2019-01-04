/**
 * @module api:area:area-get
 */

const _             = require("lodash");
const pg            = require("../../services/pg");
const price_tool    = require("../../services/price-tool");

const handler_get_area = async (request, response) => {
    const result = await pg.query(`
        SELECT      cus.area_code,
                    COUNT(*)                AS customer_count,
                    (
                        SELECT  COUNT(*)
                        FROM    app.partner     par
                        WHERE   par.area_code   = cus.area_code
                    )                       AS partner_count
        FROM        app.customer    cus
        WHERE       cus.area_code           = $1
        GROUP BY    cus.area_code
    `, [request.params.code]);

    const area = _.first(result);
    if (!area) {
        return response.statusCode(404).json({ error: "not_found" });
    }

    return response.json({
        ...area,
        price : price_tool.get_offer_price(area),
    });
};

module.exports = api => api.route("/area/:code/").get(handler_get_area);
