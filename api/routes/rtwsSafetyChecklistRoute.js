const express = require("express");
const {
	saveRtwsSafetyChecklistReport,
	getAllRtwsSafetyChecklistReports,
	getRtwsSafetyChecklistReport,
	getEveryonesRtwsSafetyChecklistReports,
	checkRtwsSafetyChecklistReportOwnership,
} = require("../controllers/rtwsSafetyChecklistController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, checkRtwsSafetyChecklistReportOwnership, saveRtwsSafetyChecklistReport);
router.get("/getall", verifyToken, getAllRtwsSafetyChecklistReports);
router.get("/get/:id", verifyToken, getRtwsSafetyChecklistReport);
router.get("/geteveryones", getEveryonesRtwsSafetyChecklistReports);

module.exports = router;
