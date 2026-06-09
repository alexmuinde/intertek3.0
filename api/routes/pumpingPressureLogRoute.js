const express = require("express");
const {
	savePumpingPressureLogReport,
	getAllPumpingPressureLogReports,
	getPumpingPressureLogReport,
	getEveryonesPumpingPressureLogReports,
} = require("../controllers/pumpingPressureLogController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

/**
 * Pumping Pressure Log Routes
 * Normalized camelCase endpoints linking cleanly with the core app shell
 */

router.post("/save", verifyToken, savePumpingPressureLogReport);
router.get("/getall", verifyToken, getAllPumpingPressureLogReports);
router.get("/get/:id", verifyToken, getPumpingPressureLogReport);
router.get("/geteveryones", getEveryonesPumpingPressureLogReports);

module.exports = router;
