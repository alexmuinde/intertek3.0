const mongoose = require("mongoose");

// Grouped sub-schema for representative sign-offs
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Marine Sealing Reports
const sealingReportSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Context Parameters
		vesselName: { type: String, required: true },
		portName: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		cargoDescription: { type: String, required: true },

		// Parallel Dynamic Primitive Lists (The "Add More..." location/seal arrays)
		sealingLocations: { type: [String], required: true },
		sealNumbers: { type: [String], required: true },

		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const SealingReport = mongoose.model("SealingReport", sealingReportSchema);
module.exports = SealingReport;
