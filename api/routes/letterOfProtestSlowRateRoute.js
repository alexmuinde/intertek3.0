const express = require("express");
const {
	saveLetterOfProtestSlowRateReport,
	getAllLetterOfProtestSlowRateReports,
	getLetterOfProtestSlowRateReport,
	getEveryonesLetterOfProtestSlowRateReports,
	checkLetterOfProtestSlowRateReportOwnership,
} = require("../controllers/letterOfProtestSlowRateController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, checkLetterOfProtestSlowRateReportOwnership, saveLetterOfProtestSlowRateReport);
router.get("/getall", verifyToken, getAllLetterOfProtestSlowRateReports);
router.get("/get/:id", verifyToken, getLetterOfProtestSlowRateReport);
router.get("/geteveryones", getEveryonesLetterOfProtestSlowRateReports);

module.exports = router;
