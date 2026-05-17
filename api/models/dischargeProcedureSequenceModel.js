const mongoose = require("mongoose");

// Grouped sub-schema for witness verification details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Discharge Procedure Sequence report
const dischargeProcedureSequenceSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Context Parameters
		vesselName: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		portName: { type: String, required: true },
		cargoGrade: { type: String, required: true },
		berthNumber: { type: String, required: true },

		// Parallel Primitive Dynamic Lists for Procedure Rows ("Add More..." entries)
		shorelines: { type: [String], required: true },
		clientNames: { type: [String], required: true },
		rowCargoGrades: { type: [String], required: true },
		billOfLadingQuantities: { type: [String], required: true },
		shipsTanks: { type: [String], required: true },
		shoreTanks: { type: [String], required: true },
		rowRemarks: { type: [String], required: true },

		// Operational Remarks Section Inputs
		manifoldPressureThresholdType: {
			type: String,
			required: true,
			enum: ["minimum", "maximum"],
		},
		manifoldPressureValue: { type: String, required: true }, // Stored as string to protect bar decimals

		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list compiled at the base anchor
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const DischargeProcedureSequence = mongoose.model(
	"DischargeProcedureSequence",
	dischargeProcedureSequenceSchema,
);
module.exports = DischargeProcedureSequence;
