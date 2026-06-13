const express = require("express");
const {
	saveWeighBridgeReport,
	getAllWeighBridgeReports,
	getWeighBridgeReport,
	getEveryonesWeighBridgeReports,
	checkWeighBridgeOwnership,
} = require("../controllers/weighBridgeController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

/**
 * Weighbridge Routes
 * Refactored for full camelCase readability matching the ecosystem standard
 */ 

// Save or Update a weighbridge entry
router.post("/save", verifyToken, checkWeighBridgeOwnership, saveWeighBridgeReport);

// Get all weighbridge reports for the logged-in user (Dashboard)
router.get("/getall", verifyToken, getAllWeighBridgeReports);

// Get a specific weighbridge report by ID (Viewing/Editing)
router.get("/get/:id", verifyToken, getWeighBridgeReport);

// Get all weighbridge reports across all users (Admin/Public view)
router.get("/geteveryones", getEveryonesWeighBridgeReports);

module.exports = router;
