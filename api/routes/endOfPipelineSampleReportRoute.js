const express = require("express");
const {
	saveEndOfPipelineSampleReport,
	getAllEndOfPipelineSampleReports,
	getEndOfPipelineSampleReport,
	getEveryonesEndOfPipelineSampleReports,
	checkEndOfPipelineSampleReportOwnership, // Imported the new write-security validation interceptor
} = require("../controllers/endOfPipelineSampleReportController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, checkEndOfPipelineSampleReportOwnership, saveEndOfPipelineSampleReport);
router.get("/getall", verifyToken, getAllEndOfPipelineSampleReports);
router.get("/get/:id", verifyToken, getEndOfPipelineSampleReport);
router.get("/geteveryones", getEveryonesEndOfPipelineSampleReports);

module.exports = router;
