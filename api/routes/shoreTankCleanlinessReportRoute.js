const express = require("express");
const {
	saveShoreTankCleanlinessReport,
	getShoreTankCleanlinessReport,
	getAllShoreTankCleanlinessReports,
	getEveryonesShoreTankCleanlinessReports,
} = require("../controllers/shoreTankCleanlinessReportController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

// Long-form explicitly clean paths mapped to block proxy path conflict bugs
router.post("/save", verifyToken, saveShoreTankCleanlinessReport);
router.get("/getall", verifyToken, getAllShoreTankCleanlinessReports);
router.get("/get/:id", verifyToken, getShoreTankCleanlinessReport);
router.get(
	"/geteveryones",
	verifyToken,
	getEveryonesShoreTankCleanlinessReports,
);

module.exports = router;
