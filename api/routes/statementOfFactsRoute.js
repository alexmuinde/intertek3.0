const express = require("express");
const {
	saveStatementOfFactsReport,
	getAllStatementOfFactsReports,
	getStatementOfFactsReport,
	getEveryonesStatementOfFactsReports,
} = require("../controllers/statementOfFactsController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

/**
 * Statement of Facts Routes
 * Standardized camelCase pathing matching the ecosystem baseline
 */

router.post("/save", verifyToken, saveStatementOfFactsReport);
router.get("/getall", verifyToken, getAllStatementOfFactsReports);
router.get("/get/:id", verifyToken, getStatementOfFactsReport);
router.get("/geteveryones", getEveryonesStatementOfFactsReports);

module.exports = router;
