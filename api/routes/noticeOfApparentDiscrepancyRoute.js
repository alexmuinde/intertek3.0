const express = require("express");
const {
	saveNoticeOfApparentDiscrepancy,
	getNoticeOfApparentDiscrepancy,
	getAllNoticeOfApparentDiscrepancies,
	getEveryonesNoticeOfApparentDiscrepancies,
} = require("../controllers/noticeOfApparentDiscrepancyController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveNoticeOfApparentDiscrepancy);
router.get("/getall", verifyToken, getAllNoticeOfApparentDiscrepancies);
router.get("/get/:id", verifyToken, getNoticeOfApparentDiscrepancy);
router.get(
	"/geteveryones",
	verifyToken,
	getEveryonesNoticeOfApparentDiscrepancies,
);

module.exports = router;
