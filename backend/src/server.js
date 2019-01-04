/**
 * @module server
 */

const express   = require("express");
const config    = require("./config");
const api       = require("./api");

//-- Create express instance --
const app = express();

//-- Mount api endpoints and start server --
app.use("/api", api);
app.listen(config.server.port, () => {
    console.log("[server] Listening on http://localhost:9999");
});
