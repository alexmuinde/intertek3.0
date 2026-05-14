const express = require("express");
const {
	saveEndOfPipelineSampleReport,
	getEndOfPipelineSampleReport,
	getAllEndOfPipelineSampleReports,
	getEveryonesEndOfPipelineSampleReports,
} = require("../controllers/endOfPipelineSampleReportController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveEndOfPipelineSampleReport);
router.get("/getall", verifyToken, getAllEndOfPipelineSampleReports);
router.get("/get/:id", verifyToken, getEndOfPipelineSampleReport);
router.get(
	"/geteveryones",
	verifyToken,
	getEveryonesEndOfPipelineSampleReports,
);

module.exports = router;
