const express = require("express");
const {
	saveLetterOfProtestGeneral,
	getLetterOfProtestGeneral,
	getAllLetterOfProtestGenerals,
	getEveryonesLetterOfProtestGenerals,
} = require("../controllers/letterOfProtestGeneralController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveLetterOfProtestGeneral);
router.get("/getall", verifyToken, getAllLetterOfProtestGenerals);
router.get("/get/:id", verifyToken, getLetterOfProtestGeneral);
router.get("/geteveryones", verifyToken, getEveryonesLetterOfProtestGenerals);

module.exports = router;
