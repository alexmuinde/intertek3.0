const mongoose = require("mongoose");

const shipsTanksUllageReportSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		port: { type: String, required: true },
		date: { type: Date, required: true },
		cargo: { type: String, required: true },
		berth: { type: String, required: true },

		// Map array tracking sub-document tank records
		tankLogs: [
			{
				tankNumber: String,
				correctedUllageSoundingMetricTons: String,
				freeWaterDipCentimeters: String,
				volumeAtTankTemperature: String,
				temperature: String,
				kilogramsPerLitreInAir: String,
				metricTonsInAir: String,
			},
		],

		totalVolume: { type: String, required: true },
		totalWeight: { type: String, required: true },

		// Analytical formula statements parameters
		kilogramsPerLitreInAirAtDegrees: { type: String },
		degreesTemperature: { type: String },
		temperatureCoefficientFactorPerDegrees: { type: String },

		// Trim state measurements
		fwd: { type: String, required: true },
		aft: { type: String, required: true },
		list: { type: String, required: true },
		seaCondition: { type: String, required: true },

		// ✅ FIXED: Kept the array collection and completely removed the old standalone root fields below it
		equipmentList: [
			{
				equipmentType: { type: String },
				serialNumber: { type: String },
				calibrationCertificateNumber: { type: String },
				expiryDate: { type: Date },
			},
		],

		intertekInspector: { type: String, required: true },

		// Verification witnesses signature sub-array
		representatives: [
			{
				name: String,
				id: String,
				email: String,
			},
		],

		// Unique link token referencing session user accounts
		userRef: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const ShipsTanksUllageReport = mongoose.model(
	"ShipsTanksUllageReport",
	shipsTanksUllageReportSchema,
);
module.exports = ShipsTanksUllageReport;
