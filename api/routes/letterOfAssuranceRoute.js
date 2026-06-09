const express = require("express");
const {
	saveLetterOfAssuranceReport,
	getAllLetterOfAssuranceReports,
	getLetterOfAssuranceReport,
	getEveryonesLetterOfAssuranceReports,
} = require("../controllers/letterOfAssuranceController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

/**
 * Letter of Assurance Routes
 * Unified camelCase structure tracking the global app core
 */

router.post("/save", verifyToken, saveLetterOfAssuranceReport);
router.get("/getall", verifyToken, getAllLetterOfAssuranceReports);
router.get("/get/:id", verifyToken, getLetterOfAssuranceReport);
router.get("/geteveryones", getEveryonesLetterOfAssuranceReports);

module.exports = router;
