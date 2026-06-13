const express = require("express");
const {
	saveNoticeOfApparentDiscrepancyReport,
	getAllNoticeOfApparentDiscrepancyReports,
	getNoticeOfApparentDiscrepancyReport,
	getEveryonesNoticeOfApparentDiscrepancyReports,
	checkNoticeOfApparentDiscrepancyReportOwnership, // Imported the new write-security validation interceptor
} = require("../controllers/noticeOfApparentDiscrepancyController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, checkNoticeOfApparentDiscrepancyReportOwnership, saveNoticeOfApparentDiscrepancyReport);
router.get("/getall", verifyToken, getAllNoticeOfApparentDiscrepancyReports);
router.get("/get/:id", verifyToken, getNoticeOfApparentDiscrepancyReport);
router.get("/geteveryones", getEveryonesNoticeOfApparentDiscrepancyReports);

module.exports = router;
