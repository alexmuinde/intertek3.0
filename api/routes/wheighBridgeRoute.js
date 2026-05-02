// 1. Change 'import' to 'const ... = require'
const express = require("express");
const {
	createWheighBridge,
} = require("../controllers/wheighBridgeController.js");
const { verifyToken } = require("../utils/verifyUser.js");

// 2. Initialize the router
const router = express.Router();

// 3. Define the POST route for creating a weigh bridge
router.post("/create", verifyToken, createWheighBridge);

// 4. Use module.exports instead of 'export default'
module.exports = router;

/**import express from "express";
import { createWheighBridge } from "../controllers/wheighBridgeController.js";

//use express to create a router
const router = express.Router();

//create a listing using the post request
router.post("/create", createWheighBridge);
 */
