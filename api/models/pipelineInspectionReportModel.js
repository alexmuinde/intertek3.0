const mongoose = require("mongoose");

// Grouped sub-schema for witness verification details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Pipeline Inspection Pigging Reports
const pipelineInspectionReportSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		// Core Identity Context Parameters
		vesselName: { type: String, required: true },
		cargoDescription: { type: String, required: true },
		clientName: { type: String, required: true },
		dateOfReport: { type: String, required: true },

		// Narrative Statement Inputs
		attendanceLocation: { type: String, required: true },
		timeOfAttendance: { type: String, required: true },
		dateOfAttendance: { type: String, required: true },
		operationType: {
			type: String,
			required: true,
			enum: ["discharge", "loading"],
		},

		// Condition Checkboxes (Stored explicitly as Booleans)
		isInternalSurfaceClean: { type: Boolean, required: true },
		isInternalSurfaceDry: { type: Boolean, required: true },
		isInternalSurfaceOdorFree: { type: Boolean, required: true },

		// Technical Properties
		pipelineConstructionMaterial: {
			type: String,
			required: true,
			enum: ["Steam", "Mild", "Coated"],
		},
		reportedPreviousContent: { type: String, required: true },
		methodsOfCleaning: { type: String, required: true },

		measurementRemarks: { type: String, required: true },
		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list compiled at the end
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const PipelineInspectionReport = mongoose.model(
	"PipelineInspectionReport",
	pipelineInspectionReportSchema,
);
module.exports = PipelineInspectionReport;
