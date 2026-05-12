const express = require("express");
const {
	saveVesselDischargeStatus,
	getVesselDischargeStatus,
	getAllVesselDischargeStatus,
	getEveryonesVesselDischargeStatus,
} = require("../controllers/vesselDischargeStatusController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, saveVesselDischargeStatus);
router.get("/getall", verifyToken, getAllVesselDischargeStatus);
router.get("/get/:id", verifyToken, getVesselDischargeStatus);
router.get("/geteveryones", verifyToken, getEveryonesVesselDischargeStatus);

module.exports = router;
