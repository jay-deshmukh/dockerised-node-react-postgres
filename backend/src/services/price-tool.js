/**
 * @module services:price-tool
 */

const _         = require("lodash");
const crypto    = require("crypto");
const config    = require("../config");
const pg        = require("./pg");

/**
 * Calculates contract price adjustment for a given area and customer.
 *
 * @param   {String}    area_code       - Area code to calculate adjustment for
 * @param   {String}    customer_id     - Public id of customer to calcualte adjustment for
 * @return  {Number}                    - Calculated price adjustment in euros to two decimals
 */
const get_customer_adjustment = (area_code, customer_id) => (!customer_id
    ? 0 //-- No adjustments if no customer is given --
    : _.round(crypto
        .createHash("sha256")
        .update(`get_customer_adjustment:${area_code}:${customer_id}`)
        .digest()
        .slice(0, 2)
        .readInt16LE(0) / 182.04, 2));

/**
 * Calculates the average contract price for a given area based on statistics of existing contract objects.
 *
 * @param   {String}    area_code   - Area code to calculate average contract price for
 * @return  {Promise<Object>}       - Object with `price` (average for given area) and `weight` (between 0 and 1, importance of price)
 */
const get_area_avg_current_price = async area_code => _.first(await pg.query(`
    SELECT      AVG(price)                      AS price,
                LEAST(COUNT(*)::float / 3, 1)   AS weight
    FROM        app.contract
    WHERE       area_code                       = $1
    GROUP BY    TRUE
`, [area_code]));

/**
 * Calculates the base contract price for a given area based on predefined values from Marketing team.
 *
 * @param   {String}    area_code   - Area code to get base contract price for
 * @return  {Number}                - Base price for a contract in the given area, or 0 if non-existing
 */
const get_area_base_price = area_code => config.price_tool.base[area_code] || 0;

/**
 * Calculate price for an offer given an area and customer id. If the customer id is undefined,
 * it will calculate the price for the given area without specific customer adjustments.
 *
 * @param   {Object}    offer                   - Offer object to calculate price for
 * @param   {Object}    offer.area_code         - Area code in offer
 * @param   {Object}    [offer.customer_id]     - Public id of customer
 * @return  {Promise<Number>}                   - Offer price in euros to two decimals
 */
const get_offer_price = async ({ area_code, customer_id }) => {
    //-- Get contract base price and price adjustment for customer --
    const base      = get_area_base_price(area_code);
    const adjust    = get_customer_adjustment(area_code, customer_id);

    //-- If no base price, the area code does not exists; report error --
    if (!base) {
        throw new Error(`[services:price-tool:get_offer_price] No base price for area/offer - area: ${area_code}`);
    }

    //-- Get current average price for area as well as the weight between 0 and 1 --
    const { price, weight } = (await get_area_avg_current_price(area_code)) || { price: 0, weight: 0 };

    //-- Make final calculation as interpolation between base and current average price plus customer adjustment --
    return _.round(price * weight + base * (1 - weight) + adjust, 2);
};

module.exports = {
    get_customer_adjustment,
    get_area_avg_current_price,
    get_area_base_price,
    get_offer_price,
};
