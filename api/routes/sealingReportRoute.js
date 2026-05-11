const express = require("express");
const {
	saveSealingReport,
	getSealingReport,
	getAllSealingReports,
	getEveryonesSealingReports,
} = require("../controllers/sealingReportController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

// Matches the patterns of your SOF routes
router.post("/save", verifyToken, saveSealingReport);
router.get("/getall", verifyToken, getAllSealingReports); // For user dashboard
router.get("/get/:id", verifyToken, getSealingReport); // For editing/viewing single report
router.get("/geteveryones", getEveryonesSealingReports); // Public or Admin view

module.exports = router;
