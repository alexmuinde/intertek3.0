const express = require("express");
const {
	saveReceiptOfSealedSamplesReport,
	getAllReceiptOfSealedSamplesReports,
	getReceiptOfSealedSamplesReport,
	getEveryonesReceiptOfSealedSamplesReports,
	checkReceiptOfSealedSamplesOwnership,
} = require("../controllers/receiptOfSealedSamplesController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

/**
 * Receipt of Sealed Samples Routes
 * Unified camelCase structure tracking the global app baseline
 */

router.post("/save", verifyToken, checkReceiptOfSealedSamplesOwnership, saveReceiptOfSealedSamplesReport);
router.get("/getall", verifyToken, getAllReceiptOfSealedSamplesReports);
router.get("/get/:id", verifyToken, getReceiptOfSealedSamplesReport);
router.get("/geteveryones", getEveryonesReceiptOfSealedSamplesReports);

module.exports = router;
