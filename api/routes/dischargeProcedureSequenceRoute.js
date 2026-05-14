const express = require("express");
const {
	saveDischargeProcedureSequence,
	getDischargeProcedureSequence,
	getAllDischargeProcedureSequences,
	getEveryonesDischargeProcedureSequences,
} = require("../controllers/dischargeProcedureSequenceController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveDischargeProcedureSequence);
router.get("/getall", verifyToken, getAllDischargeProcedureSequences);
router.get("/get/:id", verifyToken, getDischargeProcedureSequence);
router.get(
	"/geteveryones",
	verifyToken,
	getEveryonesDischargeProcedureSequences,
);

module.exports = router;
