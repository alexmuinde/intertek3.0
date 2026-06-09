const express = require("express");
const {
	saveNoticeOfApparentDiscrepancyReport,
	getAllNoticeOfApparentDiscrepancyReports,
	getNoticeOfApparentDiscrepancyReport,
	getEveryonesNoticeOfApparentDiscrepancyReports,
} = require("../controllers/noticeOfApparentDiscrepancyController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveNoticeOfApparentDiscrepancyReport);
router.get("/getall", verifyToken, getAllNoticeOfApparentDiscrepancyReports);
router.get("/get/:id", verifyToken, getNoticeOfApparentDiscrepancyReport);
router.get("/geteveryones", getEveryonesNoticeOfApparentDiscrepancyReports);

module.exports = router;
