const mongoose = require("mongoose");

// Grouped sub-schema for witness verification details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for End of Pipeline Sample Report
const endOfPipelineSampleReportSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Context Parameters
		vesselName: { type: String, required: true },
		locationName: { type: String, required: true },
		productDescription: { type: String, required: true },
		installationName: { type: String, required: true },
		cargoGrade: { type: String, required: true },
		pipelineName: { type: String, required: true },

		// Attendance Narrative Parameters
		attendanceLocation: { type: String, required: true },
		timeOfAttendance: { type: String, required: true },
		dateOfAttendance: { type: String, required: true },
		operationType: {
			type: String,
			required: true,
			enum: ["discharge", "back-loading", "transfer"],
		},
		narrativeCargoGrade: { type: String, required: true },
		narrativeVesselName: { type: String, required: true },

		// Parallel Primitive Dynamic Lists for Time-Series Sampling Records ("Add More..." entries)
		samplingTimes: { type: [String], required: true }, // Time entries for individual logs
		visualColours: { type: [String], required: true },
		waterPresences: { type: [String], required: true },
		otherObservations: { type: [String], required: true },

		measurementRemarks: { type: String, required: true },
		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list compiled at the base anchor
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const EndOfPipelineSampleReport = mongoose.model(
	"EndOfPipelineSampleReport",
	endOfPipelineSampleReportSchema,
);
module.exports = EndOfPipelineSampleReport;
