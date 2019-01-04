/**
 * @module api
 */

const express   = require("express");
const cors      = require("cors");
const config    = require("../config");

//-- Setup API router --
const api = express.Router({ mergeParams: true });
api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(cors(config.cors));

//-- Endpoints --
require("./area/area-get")(api);
require("./area/areas-list")(api);
require("./contract/contract-get")(api);
require("./contract/contracts-list")(api);
require("./customer/customer-get")(api);
require("./customer/customers-list")(api);
require("./offer/offer-post")(api);
require("./partner/partner-get")(api);
require("./partner/partners-list")(api);

//-- API 404 errors --
api.use((req, res) => res.status(404).json({ error: "not_found" }));

module.exports = api;
