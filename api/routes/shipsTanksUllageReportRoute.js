const express = require("express");
const {
	saveShipsTanksUllageReport,
	getShipsTanksUllageReport,
	getAllShipsTanksUllageReports,
	getEveryonesShipsTanksUllageReports,
} = require("../controllers/shipsTanksUllageReportController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

// Strict explicit structural mount path strings
router.post("/save", verifyToken, saveShipsTanksUllageReport);
router.get("/getall", verifyToken, getAllShipsTanksUllageReports);
router.get("/get/:id", verifyToken, getShipsTanksUllageReport);
router.get("/geteveryones", verifyToken, getEveryonesShipsTanksUllageReports);

module.exports = router;
