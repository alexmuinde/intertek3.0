const mongoose = require("mongoose");

// Grouped sub-schema for witness verification details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Letter of Protest - Slow Rate
const letterOfProtestSlowRateSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Context Parameters
		recipientName: { type: String, required: true },
		vesselName: { type: String, required: true },
		portName: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		cargoDescription: { type: String, required: true },
		operationType: {
			type: String,
			required: true,
			enum: ["Discharge", "Loading"],
		},

		// REFACTORED: Parallel Primitive Dynamic Lists for Operation Timelines ("Add More..." entries)
		commencedAtTimes: { type: [String], required: true },
		commencedAtDates: { type: [String], required: true },
		completedAtTimes: { type: [String], required: true },
		completedAtDates: { type: [String], required: true },
		delayInterruptionTypes: {
			type: [String],
			required: true,
			enum: ["Stoppages", "Suspensions"],
		},
		operationalRemarks: { type: [String], required: true },

		// Summary Metric Values Group
		totalOperationTime: { type: String, required: true },
		operationQuantity: { type: String, required: true },
		calculatedOperationRate: { type: String, required: true },

		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list compiled at the end
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const LetterOfProtestSlowRate = mongoose.model(
	"LetterOfProtestSlowRate",
	letterOfProtestSlowRateSchema,
);
module.exports = LetterOfProtestSlowRate;
