const express = require("express");
const {
	saveLetterOfProtestShoreFinalOutturnFiguresReport,
	getAllLetterOfProtestShoreFinalOutturnFiguresReports,
	getLetterOfProtestShoreFinalOutturnFiguresReport,
	getEveryonesLetterOfProtestShoreFinalOutturnFiguresReports,
} = require("../controllers/letterOfProtestShoreFinalOutturnFiguresController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post(
	"/save",
	verifyToken,
	saveLetterOfProtestShoreFinalOutturnFiguresReport,
);
router.get(
	"/getall",
	verifyToken,
	getAllLetterOfProtestShoreFinalOutturnFiguresReports,
);
router.get(
	"/get/:id",
	verifyToken,
	getLetterOfProtestShoreFinalOutturnFiguresReport,
);
router.get(
	"/geteveryones",
	getEveryonesLetterOfProtestShoreFinalOutturnFiguresReports,
);

module.exports = router;
