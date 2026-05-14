const express = require("express");
const {
	saveLetterOfAssurance,
	getLetterOfAssurance,
	getAllLetterOfAssurances,
	getEveryonesLetterOfAssurances,
} = require("../controllers/letterOfAssuranceController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveLetterOfAssurance);
router.get("/getall", verifyToken, getAllLetterOfAssurances);
router.get("/get/:id", verifyToken, getLetterOfAssurance);
router.get("/geteveryones", verifyToken, getEveryonesLetterOfAssurances);

module.exports = router;
