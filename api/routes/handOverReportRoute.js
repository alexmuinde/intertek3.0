const express = require("express");
const {
	saveHandOverReport,
	getHandOverReport,
	getAllHandOverReports,
	getEveryonesHandOverReports,
} = require("../controllers/handOverReportController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveHandOverReport);
router.get("/getall", verifyToken, getAllHandOverReports);
router.get("/get/:id", verifyToken, getHandOverReport);
router.get("/geteveryones", verifyToken, getEveryonesHandOverReports);

module.exports = router;
