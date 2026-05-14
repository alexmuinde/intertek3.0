const express = require("express");
const {
	savePipelineInspectionReport,
	getPipelineInspectionReport,
	getAllPipelineInspectionReports,
	getEveryonesPipelineInspectionReports,
} = require("../controllers/pipelineInspectionReportController.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/save", verifyToken, savePipelineInspectionReport);
router.get("/getall", verifyToken, getAllPipelineInspectionReports);
router.get("/get/:id", verifyToken, getPipelineInspectionReport);
router.get("/geteveryones", verifyToken, getEveryonesPipelineInspectionReports);

module.exports = router;
