const express = require("express");
const {
	saveVesselExperienceFactorReport,
	getVesselExperienceFactorReport,
	getAllVesselExperienceFactorReports,
	getEveryonesVesselExperienceFactorReports,
} = require("../controllers/vesselExperienceFactorController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

/**
 * Vessel Experience Factor (VEF) Routes
 * Refactored for full camelCase readability
 */

// Save or Update a report
router.post("/save", verifyToken, saveVesselExperienceFactorReport);

// Get all reports for the logged-in user (Dashboard)
router.get("/getall", verifyToken, getAllVesselExperienceFactorReports);

// Get a specific report by ID (Viewing/Editing)
router.get("/get/:id", verifyToken, getVesselExperienceFactorReport);

// Get all reports across all users (Admin/Public view)
router.get("/geteveryones", getEveryonesVesselExperienceFactorReports);

module.exports = router;
