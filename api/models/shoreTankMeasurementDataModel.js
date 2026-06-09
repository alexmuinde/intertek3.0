const mongoose = require("mongoose");

// Grouped sub-schema for witness validation details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Shore Tank Measurement Data Reports
const shoreTankMeasurementDataSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Context Parameters
		dateOfReport: { type: String, required: true },
		installationName: { type: String, required: true },
		tankNumberHeader: { type: String, required: true },
		vesselName: { type: String, required: true },
		accountName: { type: String, required: true },
		cargoGrade: { type: String, required: true },

		// REFACTORED: Parallel Dynamic Lists for the Measurement Cards ("Add More..." entries)
		tankNumbers: { type: [String], required: true },
		overallDips: { type: [Number], required: true },
		productDips: { type: [Number], required: true },
		temperatures: { type: [Number], required: true },
		timesOfMeasurements: { type: [String], required: true },

		// Sample Type Checkbox Booleans
		isBeforeDischarge: { type: Boolean, required: true },
		isAfterDischarge: { type: Boolean, required: true },
		isUpperSample: { type: Boolean, required: true },
		isMiddleSample: { type: Boolean, required: true },
		isLowerSample: { type: Boolean, required: true },
		isRunningSample: { type: Boolean, required: true },
		isProfileSample: { type: Boolean, required: true },
		numberOfSamples: { type: Number, required: true },

		// Reason For Sampling Checkbox Booleans
		isSamplingForDensity: { type: Boolean, required: true },
		isSamplingForAnalysis: { type: Boolean, required: true },
		isSamplingForRetention: { type: Boolean, required: true },

		measurementRemarks: { type: String, required: true },
		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const ShoreTankMeasurementData = mongoose.model(
	"ShoreTankMeasurementData",
	shoreTankMeasurementDataSchema,
);
module.exports = ShoreTankMeasurementData;
