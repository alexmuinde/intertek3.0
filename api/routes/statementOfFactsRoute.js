const express = require("express");
const {
	getAllSOF,
	saveSOF,
	getSOF,
	getEveryonesDocs,
} = require("../controllers/statementOfFactsController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveSOF);
router.get("/getall", verifyToken, getAllSOF); // This handles the dashboard fetch
router.get("/get/:id", verifyToken, getSOF);
router.get("/geteveryones", getEveryonesDocs);

module.exports = router;
