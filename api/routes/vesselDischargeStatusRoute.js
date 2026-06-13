const express = require("express");
const {
	saveVesselDischargeStatusReport,
	getAllVesselDischargeStatusReports,
	getVesselDischargeStatusReport,
	getEveryonesVesselDischargeStatusReports,
	checkVesselDischargeStatusOwnership, // Reusing the same ownership check for consistency
} = require("../controllers/vesselDischargeStatusController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, checkVesselDischargeStatusOwnership, saveVesselDischargeStatusReport);
router.get("/getall", verifyToken, getAllVesselDischargeStatusReports);
router.get("/get/:id", verifyToken, getVesselDischargeStatusReport);
router.get("/geteveryones", getEveryonesVesselDischargeStatusReports);

module.exports = router;
