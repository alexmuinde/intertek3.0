const express = require("express");
const {
	saveLetterOfProtestGeneralReport,
	getAllLetterOfProtestGeneralReports,
	getLetterOfProtestGeneralReport,
	getEveryonesLetterOfProtestGeneralReports,
} = require("../controllers/letterOfProtestGeneralController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveLetterOfProtestGeneralReport);
router.get("/getall", verifyToken, getAllLetterOfProtestGeneralReports);
router.get("/get/:id", verifyToken, getLetterOfProtestGeneralReport);
router.get("/geteveryones", getEveryonesLetterOfProtestGeneralReports);

module.exports = router;
