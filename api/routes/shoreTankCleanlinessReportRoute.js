const express = require("express");
const {
	saveShoreTankCleanlinessReport,
	getShoreTankCleanlinessReport,
	getAllShoreTankCleanlinessReports,
	getEveryonesShoreTankCleanlinessReports,
	checkShoreTankCleanlinessReportOwnership, // Imported the new write-security validation interceptor
} = require("../controllers/shoreTankCleanlinessReportController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

// Long-form explicitly clean paths mapped to block proxy path conflict bugs
router.post("/save", verifyToken, checkShoreTankCleanlinessReportOwnership, saveShoreTankCleanlinessReport);
router.get("/getall", verifyToken, getAllShoreTankCleanlinessReports);
router.get("/get/:id", verifyToken, getShoreTankCleanlinessReport);
router.get(
	"/geteveryones",
	verifyToken,
	getEveryonesShoreTankCleanlinessReports,
);

module.exports = router;
