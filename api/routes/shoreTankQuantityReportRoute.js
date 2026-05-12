const express = require("express");
const {
	saveShoreTankQuantityReport,
	getShoreTankQuantityReport,
	getAllShoreTankQuantityReports,
	getEveryonesShoreTankQuantityReports, // Add this controller import
} = require("../controllers/shoreTankQuantityReportController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

// Matches the exact patterns of your other official documents
router.post("/save", verifyToken, saveShoreTankQuantityReport);
router.get("/getall", verifyToken, getAllShoreTankQuantityReports); // Personal user dashboard
router.get("/get/:id", verifyToken, getShoreTankQuantityReport); // Edit/View single report
router.get("/geteveryones", getEveryonesShoreTankQuantityReports); // Global dashboard view

module.exports = router;
