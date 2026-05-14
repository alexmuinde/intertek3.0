const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser"); // 1. Import cookie-parser
const userRouter = require("./routes/userRoute.js");
const authRouter = require("./routes/authRoute.js");
const wheighBridgeRouter = require("./routes/wheighBridgeRoute.js");
const statementOfFactsRouter = require("./routes/statementOfFactsRoute.js");
const sealingReportRouter = require("./routes/sealingReportRoute.js");
const vesselExperienceFactorRouter = require("./routes/vesselExperienceFactorRoute.js");
const vesselDischargeStatusRouter = require("./routes/vesselDischargeStatusRoute.js");
const shoreTankQuantityReportRouter = require("./routes/shoreTankQuantityReportRoute.js");
const shoreTankMeasurementDataRouter = require("./routes/shoreTankMeasurementDataRoute.js");
const shoreTankCleanlinessReportRouter = require("./routes/shoreTankCleanlinessReportRoute.js");
const shipsTanksUllageReportRouter = require("./routes/shipsTanksUllageReportRoute.js");
const rtwsSafetyChecklistRouter = require("./routes/rtwsSafetyChecklistRoute.js");
const receiptOfSealedSamplesRouter = require("./routes/receiptOfSealedSamplesRoute.js");
const pumpingPressureLogRouter = require("./routes/pumpingPressureLogRoute.js");
const pipelineInspectionReportRouter = require("./routes/pipelineInspectionReportRoute.js");
const noticeOfApparentDiscrepancyRouter = require("./routes/noticeOfApparentDiscrepancyRoute.js");
const letterOfProtestSlowRateRouter = require("./routes/letterOfProtestSlowRateRoute.js");
const letterOfProtestShoreFinalOutturnFiguresRouter = require("./routes/letterOfProtestShoreFinalOutturnFiguresRoute.js");
const letterOfProtestGeneralRouter = require("./routes/letterOfProtestGeneralRoute.js");
const letterOfAssuranceRouter = require("./routes/letterOfAssuranceRoute.js");
const handOverReportRouter = require("./routes/handOverReportRoute.js");
const endOfPipelineSampleReportRouter = require("./routes/endOfPipelineSampleReportRoute.js");
const dischargeProcedureSequenceRouter = require("./routes/dischargeProcedureSequenceRoute.js");

dotenv.config();

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

mongoose
	.connect(process.env.MONGO)
	.then(() => console.log("Connected to MongoDB!"))
	.catch((err) => {
		console.error("DATABASE CONNECTION ERROR:", err.message);
	});

const app = express();

// --- MIDDLEWARE SECTION ---
app.use(express.json());
app.use(cookieParser()); // 2. Initialize cookie-parser here

// --- ROUTES SECTION ---
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/wheighBridge", wheighBridgeRouter);
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
app.use(
	"/api/letterOfProtestShoreFinalOutturnFigures",
	letterOfProtestShoreFinalOutturnFiguresRouter,
);
app.use("/api/letterOfProtestGeneral", letterOfProtestGeneralRouter);
app.use("/api/letterOfAssurance", letterOfAssuranceRouter);
app.use("/api/handOverReport", handOverReportRouter);
app.use("/api/endOfPipelineSampleReport", endOfPipelineSampleReportRouter);
app.use("/api/dischargeProcedureSequence", dischargeProcedureSequenceRouter);

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});

app.listen(3000, () => {
	console.log("Server is running on port 3000!!!");
});

/**const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/userRoute.js');
const authRouter = require('./routes/authRoute.js')

dotenv.config()

const dns = require("dns");const e = require('express');
 dns.setServers(["1.1.1.1", "8.8.8.8"]);



mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => {
    console.error('DATABASE CONNECTION ERROR:', err.message); // This will show you WHY it's failing
  });

// Add this to listen for errors that happen AFTER the initial connection
mongoose.connection.on('error', err => {
  console.error('Mongoose secondary connection error:', err);
});


const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000!!!')
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

//create a middleware to catch errors
app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false, statusCode, message
    })
}) */
