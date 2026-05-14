const mongoose = require("mongoose");

const shoreTankMeasurementSchema = new mongoose.Schema(
	{
		date: { type: Date, required: true },
		installation: { type: String, required: true },
		tankNumber: { type: String, required: true },
		vessel: { type: String, required: true },
		account: { type: String, required: true },
		grade: { type: String, required: true },

		// Nested array tracking multiple dynamic dip items
		tankMeasurements: [
			{
				tankNumberDetail: String,
				overallDip: String,
				productDip: String,
				temperature: String,
				time: String,
			},
		],

		// Sampling Checkboxes
		beforeDischarge: { type: Boolean, default: false },
		afterDischarge: { type: Boolean, default: false },
		upper: { type: Boolean, default: false },
		middle: { type: Boolean, default: false },
		lower: { type: Boolean, default: false },
		running: { type: Boolean, default: false },
		profile: { type: Boolean, default: false },
		numberOfSamples: { type: String },

		// Sampling Reasons
		reasonDensity: { type: Boolean, default: false },
		reasonAnalysis: { type: Boolean, default: false },
		reasonRetention: { type: Boolean, default: false },

		remarks: { type: String },
		intertekInspector: { type: String, required: true },

		// Nested array tracking validation signatures
		representatives: [
			{
				name: String,
				id: String,
				email: String,
			},
		],

		// Inspector access relation reference
		userRef: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const ShoreTankMeasurement = mongoose.model(
	"ShoreTankMeasurement",
	shoreTankMeasurementSchema,
);
module.exports = ShoreTankMeasurement;
