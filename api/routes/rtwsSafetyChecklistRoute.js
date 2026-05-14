const express = require("express");
const {
	saveRtwsSafetyChecklist,
	getRtwsSafetyChecklist,
	getAllRtwsSafetyChecklists,
	getEveryonesRtwsSafetyChecklists,
} = require("../controllers/rtwsSafetyChecklistController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveRtwsSafetyChecklist);
router.get("/getall", verifyToken, getAllRtwsSafetyChecklists);
router.get("/get/:id", verifyToken, getRtwsSafetyChecklist);
router.get("/geteveryones", verifyToken, getEveryonesRtwsSafetyChecklists);

module.exports = router;
