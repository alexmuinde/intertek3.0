const express = require("express");
const {
	saveShoreTankMeasurement,
	getShoreTankMeasurement,
	getAllShoreTankMeasurements,
	getEveryonesShoreTankMeasurements,
} = require("../controllers/shoreTankMeasurementDataController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveShoreTankMeasurement);
router.get("/getall", verifyToken, getAllShoreTankMeasurements);
router.get("/get/:id", verifyToken, getShoreTankMeasurement);
router.get("/geteveryones", verifyToken, getEveryonesShoreTankMeasurements);

module.exports = router;
