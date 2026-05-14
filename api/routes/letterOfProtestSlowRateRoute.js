const express = require("express");
const {
	saveLetterOfProtestSlowRate,
	getLetterOfProtestSlowRate,
	getAllLetterOfProtestSlowRates,
	getEveryonesLetterOfProtestSlowRates,
} = require("../controllers/letterOfProtestSlowRateController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveLetterOfProtestSlowRate);
router.get("/getall", verifyToken, getAllLetterOfProtestSlowRates);
router.get("/get/:id", verifyToken, getLetterOfProtestSlowRate);
router.get("/geteveryones", verifyToken, getEveryonesLetterOfProtestSlowRates);

module.exports = router;
