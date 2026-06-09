// client/src/routes/sealingReportRoute.js
const express = require("express");
const {
	saveSealingReport,
	getSealingReport,
	getAllSealingReports,
	getEveryonesSealingReports,
	checkSealingReportOwnership, // Imported the new write-security validation interceptor
} = require("../controllers/sealingReportController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

// Matches the patterns of your SOF routes - Secured with multi-tier middleware chaining
router.post("/save", verifyToken, checkSealingReportOwnership, saveSealingReport);

router.get("/getall", verifyToken, getAllSealingReports); // For user dashboard
router.get("/get/:id", verifyToken, getSealingReport); // For editing/viewing single report - now returns { report, isOwner }
router.get("/geteveryones", getEveryonesSealingReports); // Public or Admin view Activity Log Feed

module.exports = router;
