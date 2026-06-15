import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dns from "dns";

// Fix for database DNS lookup issues on serverless architectures
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Route Imports
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import weighBridgeRouter from "./routes/weighBridgeRoute.js";
import statementOfFactsRouter from "./routes/statementOfFactsRoute.js";
import sealingReportRouter from "./routes/sealingReportRoute.js";
import vesselExperienceFactorRouter from "./routes/vesselExperienceFactorRoute.js";
import vesselDischargeStatusRouter from "./routes/vesselDischargeStatusRoute.js";
import shoreTankQuantityReportRouter from "./routes/shoreTankQuantityReportRoute.js";
import shoreTankMeasurementDataRouter from "./routes/shoreTankMeasurementDataRoute.js";
import shoreTankCleanlinessReportRouter from "./routes/shoreTankCleanlinessReportRoute.js";
import shipsTanksUllageReportRouter from "./routes/shipsTanksUllageReportRoute.js";
import rtwsSafetyChecklistRouter from "./routes/rtwsSafetyChecklistRoute.js";
import receiptOfSealedSamplesRouter from "./routes/receiptOfSealedSamplesRoute.js";
import pumpingPressureLogRouter from "./routes/pumpingPressureLogRoute.js";
import pipelineInspectionReportRouter from "./routes/pipelineInspectionReportRoute.js";
import noticeOfApparentDiscrepancyRouter from "./routes/noticeOfApparentDiscrepancyRoute.js";
import letterOfProtestSlowRateRouter from "./routes/letterOfProtestSlowRateRoute.js";
import letterOfProtestShoreFinalOutturnFiguresRouter from "./routes/letterOfProtestShoreFinalOutturnFiguresRoute.js";
import letterOfProtestGeneralRouter from "./routes/letterOfProtestGeneralRoute.js";
import letterOfAssuranceRouter from "./routes/letterOfAssuranceRoute.js";
import handOverReportRouter from "./routes/handOverReportRoute.js";
import endOfPipelineSampleReportRouter from "./routes/endOfPipelineSampleReportRoute.js";
import dischargeProcedureSequenceRouter from "./routes/dischargeProcedureSequenceRoute.js";

dotenv.config();

// Connect to Database
mongoose
	.connect(process.env.MONGO)
	.then(() => console.log("Connected to MongoDB!"))
	.catch((err) => {
		console.error("DATABASE CONNECTION ERROR:", err.message);
	});

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/weighBridge", weighBridgeRouter);
app.use("/api/statementOfFacts", statementOfFactsRouter);
app.use("/api/sealingReport", sealingReportRouter);
app.use("/api/vesselExperienceFactor", vesselExperienceFactorRouter);
app.use("/api/vesselDischargeStatus", vesselDischargeStatusRouter);
app.use("/api/shoreTankQuantityReport", shoreTankQuantityReportRouter);
app.use("/api/shoreTankMeasurementData", shoreTankMeasurementDataRouter);
app.use("/api/shoreTankCleanlinessReport", shoreTankCleanlinessReportRouter);
app.use("/api/shipsTanksUllageReport", shipsTanksUllageReportRouter);
app.use("/api/rtwsSafetyChecklist", rtwsSafetyChecklistRouter);
app.use("/api/receiptOfSealedSamples", receiptOfSealedSamplesRouter);
app.use("/api/pumpingPressureLog", pumpingPressureLogRouter);
app.use("/api/pipelineInspectionReport", pipelineInspectionReportRouter);
app.use("/api/noticeOfApparentDiscrepancy", noticeOfApparentDiscrepancyRouter);
app.use("/api/letterOfProtestSlowRate", letterOfProtestSlowRateRouter);
app.use("/api/letterOfProtestShoreFinalOutturnFigures", letterOfProtestShoreFinalOutturnFiguresRouter);
app.use("/api/letterOfProtestGeneral", letterOfProtestGeneralRouter);
app.use("/api/letterOfAssurance", letterOfAssuranceRouter);
app.use("/api/handOverReport", handOverReportRouter);
app.use("/api/endOfPipelineSampleReport", endOfPipelineSampleReportRouter);
app.use("/api/dischargeProcedureSequence", dischargeProcedureSequenceRouter);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});

// Conditionally listen ONLY when running locally, NOT on Vercel serverless
if (process.env.NODE_ENV !== 'production') {
	app.listen(3000, () => {
		console.log("Local Server running on port 3000!!!");
	});
}

export default app;
