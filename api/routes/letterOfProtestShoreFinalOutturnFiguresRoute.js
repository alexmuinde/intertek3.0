const express = require("express");
const {
	saveLetterOfProtestShoreFinalOutturnFigures,
	getLetterOfProtestShoreFinalOutturnFigures,
	getAllLetterOfProtestShoreFinalOutturnFigures,
	getEveryonesLetterOfProtestShoreFinalOutturnFigures,
} = require("../controllers/letterOfProtestShoreFinalOutturnFiguresController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveLetterOfProtestShoreFinalOutturnFigures);
router.get(
	"/getall",
	verifyToken,
	getAllLetterOfProtestShoreFinalOutturnFigures,
);
router.get("/get/:id", verifyToken, getLetterOfProtestShoreFinalOutturnFigures);
router.get(
	"/geteveryones",
	verifyToken,
	getEveryonesLetterOfProtestShoreFinalOutturnFigures,
);

module.exports = router;
