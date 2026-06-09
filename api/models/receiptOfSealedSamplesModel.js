const mongoose = require("mongoose");

// Grouped sub-schema for witness verification details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Receipt of Sealed Samples reports
const receiptOfSealedSamplesSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Context Parameters
		intertekInspector: { type: String, required: true },
		vesselName: { type: String, required: true },
		clientName: { type: String, required: true },
		portOfLoading: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		cargoDescription: { type: String, required: true },

		// Parallel Dynamic Primitive Lists (The "Add More..." log entries)
		sampleGrades: { type: [String], required: true },
		sizesOfSamples: { type: [String], required: true },
		sealNumbers: { type: [String], required: true },
		sampleDescriptions: { type: [String], required: true },

		// Grouped repeatable representatives list moved structurally to the end
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const ReceiptOfSealedSamples = mongoose.model(
	"ReceiptOfSealedSamples",
	receiptOfSealedSamplesSchema,
);
module.exports = ReceiptOfSealedSamples;
