const express = require("express");
const {
	saveReceiptOfSealedSamples,
	getReceiptOfSealedSamples,
	getAllReceiptOfSealedSamples,
	getEveryonesReceiptOfSealedSamples,
} = require("../controllers/receiptOfSealedSamplesController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveReceiptOfSealedSamples);
router.get("/getall", verifyToken, getAllReceiptOfSealedSamples);
router.get("/get/:id", verifyToken, getReceiptOfSealedSamples);
router.get("/geteveryones", verifyToken, getEveryonesReceiptOfSealedSamples);

module.exports = router;
