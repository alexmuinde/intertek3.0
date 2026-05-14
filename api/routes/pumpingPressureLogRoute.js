const express = require("express");
const {
	savePumpingPressureLog,
	getPumpingPressureLog,
	getAllPumpingPressureLogs,
	getEveryonesPumpingPressureLogs,
} = require("../controllers/pumpingPressureLogController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, savePumpingPressureLog);
router.get("/getall", verifyToken, getAllPumpingPressureLogs);
router.get("/get/:id", verifyToken, getPumpingPressureLog);
router.get("/geteveryones", verifyToken, getEveryonesPumpingPressureLogs);

module.exports = router;
