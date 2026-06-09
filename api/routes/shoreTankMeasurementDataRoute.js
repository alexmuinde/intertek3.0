const express = require("express");
const {
	saveShoreTankMeasurementDataReport,
	getAllShoreTankMeasurementDataReports,
	getShoreTankMeasurementDataReport,
	getEveryonesShoreTankMeasurementDataReports,
} = require("../controllers/shoreTankMeasurementDataController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

/**
 * Shore Tank Measurement Data Routes
 * Standardized camelCase endpoints mapping cleanly with the app shell
 */

router.post("/save", verifyToken, saveShoreTankMeasurementDataReport);
router.get("/getall", verifyToken, getAllShoreTankMeasurementDataReports);
router.get("/get/:id", verifyToken, getShoreTankMeasurementDataReport);
router.get("/geteveryones", getEveryonesShoreTankMeasurementDataReports);

module.exports = router;
