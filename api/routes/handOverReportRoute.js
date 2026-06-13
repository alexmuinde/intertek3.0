const express = require("express");
const {
	saveHandOverReport,
	getAllHandOverReports,
	getHandOverReport,
	getEveryonesHandOverReports,
	checkHandOverReportOwnership, // Imported the new write-security validation interceptor
} = require("../controllers/handOverReportController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

/**
 * Hand Over Report Routes
 * Standardized camelCase pathing matching the ecosystem baseline
 */

router.post("/save", verifyToken, checkHandOverReportOwnership, saveHandOverReport);
router.get("/getall", verifyToken, getAllHandOverReports);
router.get("/get/:id", verifyToken, getHandOverReport);
router.get("/geteveryones", getEveryonesHandOverReports);

module.exports = router;
