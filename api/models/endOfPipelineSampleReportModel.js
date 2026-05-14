const mongoose = require("mongoose");

const endOfPipelineSampleReportSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		location: { type: String, required: true },
		product: { type: String, required: true },
		installation: { type: String, required: true },
		grade: { type: String, required: true },
		pipeline: { type: String, required: true },

		// Narrative structural elements
		attendanceLocation: { type: String, required: true },
		attendanceTime: { type: String, required: true },
		attendanceDate: { type: Date, required: true },
		operationType: { type: String, required: true },
		attendanceGrade: { type: String, required: true },
		attendanceVessel: { type: String, required: true },

		// Sub-array tracking multiple sequential sampling logs
		sampleLogs: [
			{
				samplingTime: String,
				visualColour: String,
				waterPresence: String,
				otherMetrics: String,
			},
		],

		remarks: { type: String, required: true },
		intertekInspector: { type: String, required: true },

		representatives: [
			{
				name: String,
				id: String,
				email: String,
			},
		],

		userRef: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const EndOfPipelineSampleReport = mongoose.model(
	"EndOfPipelineSampleReport",
	endOfPipelineSampleReportSchema,
);
module.exports = EndOfPipelineSampleReport;
