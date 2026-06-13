const express = require("express");
const {
	saveDischargeProcedureSequenceReport,
	getAllDischargeProcedureSequenceReports,
	getDischargeProcedureSequenceReport,
	getEveryonesDischargeProcedureSequenceReports,
	checkDischargeProcedureSequenceReportOwnership, // Imported the new write-security validation interceptor
} = require("../controllers/dischargeProcedureSequenceController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, checkDischargeProcedureSequenceReportOwnership, saveDischargeProcedureSequenceReport);
router.get("/getall", verifyToken, getAllDischargeProcedureSequenceReports);
router.get("/get/:id", verifyToken, getDischargeProcedureSequenceReport);
router.get("/geteveryones", getEveryonesDischargeProcedureSequenceReports);

module.exports = router;
