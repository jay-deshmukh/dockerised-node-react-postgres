/**
 * @module services:pg
 */

const _         = require("lodash");
const { Pool }  = require("pg");

//-- Connect pool to PG instance --
const pool = new Pool();

/**
 * Run PG query. You can use `$1`, `$2`, etc. as placeholders, which refers to the supplied parameters.
 *
 * @param   {String}    sql         - SQL code to run, optionally with placeholders `$1`, `$2`, etc.
 * @param   {Object[]}  [params]    - Optional list of parameters interpolated into SQL placeholders
 * @return  {Promise<Object[]>}     - List of rows from executing the SQL statement
 */
const query = async (sql, params = []) => {
    console.log(`[services:pg:query][info] - Running query - params: ${params} - sql:\n${sql}`);

    try {
        return _.get(await pool.query(sql, params), "rows", []);
    } catch (error) {
        console.log(`[services:pg:query][error] - Failed to run query - params: ${params} - error: ${JSON.stringify(error)} - stack: ${(error || {}).stack} - sql:\n${sql}`);
        throw error;
    }
};

module.exports = {
    pool,
    query,
};
