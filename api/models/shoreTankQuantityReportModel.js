const mongoose = require("mongoose");

const shoreTankQuantityReportSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		date: { type: Date, required: true },
		port: { type: String, required: true },
		installation: { type: String },
		product: { type: String },
		operation: { type: String },

		// Updated to Array to support "Add Tank" functionality
		measurements: [
			{
				overallDipMm: String,
				productDipMm: String,
				tankTemp: String,
				density: String,
				observedVolLtrs: String,
				weightMTonsAir: String,
			},
		],

		densityAt: { type: String, default: "30" },
		coefficientFactor: String,

		// Equipment Calibration
		dippingTapeSerial: String,
		dippingTapeCert: String,
		dippingTapeExpiry: String,
		thermometerSerial: String,
		thermometerCert: String,
		thermometerExpiry: String,

		remarks: { type: String },
		inspectorName: { type: String, required: true },

		// Updated to match your dynamic Representative logic
		representatives: [
			{
				name: String,
				id: String,
				email: String,
			},
		],

		userRef: {
			type: mongoose.Schema.Types.ObjectId, // MUST be ObjectId, not String
			ref: "User", // MUST match your User model name
			required: true,
		},
	},
	{ timestamps: true },
);

const ShoreTankQuantityReport = mongoose.model(
	"ShoreTankQuantityReport",
	shoreTankQuantityReportSchema,
);
module.exports = ShoreTankQuantityReport;
