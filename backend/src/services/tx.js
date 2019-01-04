/**
 * @module services:tx
 */

const util  = require("util");
const pg    = require("./pg");

/**
 * Parse JSON in a safe way. If it fails to parse, it will return the value as-is.
 *
 * @param   {String}    json    - JSON string to parse
 * @return  {Object}            - Parsed JSON data, or the original string if it failed
 */
const parse_json = (json) => {
    try {
        return JSON.parse(json);
    } catch (error) {
        return json;
    }
};

/**
 * Send a message to be asynchronously executed.
 *
 * @param   {Object}    message         - Message object to send
 * @param   {String}    message.path    - Path of operation to invoke
 * @param   {String}    message.source  - Sender of message, for debugging
 * @param   {Object}    message.data    - Data for the operation
 * @return  {Promise<Object>}           - Returns an object with message `path` if successful
 */
const send = async (message) => {
    const { path }  = message;
    const payload   = JSON.stringify(message);
    try {
        console.log(`[services:tx:send][info] - Sending message - path: ${path} - payload: ${payload}`);
        const result = await pg.query("SELECT PG_NOTIFY('app_backend_tx', $1)", [payload]);
        console.log(`[services:tx:send][info] - Sent message - path: ${path} - result: ${JSON.stringify(result)}`);
        return { path };
    } catch (error) {
        console.log(`[services:tx:send][error] - Failed to send message - path: ${path} - error: ${JSON.stringify(error)} - payload: ${payload} - stack: ${(error || {}).stack}`);
        throw error;
    }
};

//-- Log transactions --
(async () => {
    const client = await pg.pool.connect();
    client.on("notification", (notification) => {
        const message = { ...notification, payload: parse_json(notification.payload) };
        console.log(`[services:tx:notification][info] - Received message:\n\n${util.inspect(message).replace(/^/gm, "    ")}\n`);
    });
    await client.query("LISTEN app_backend_tx");
})();

module.exports = {
    send,
};
