const mongoose = require("mongoose");

const pipelineInspectionReportSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		cargo: { type: String, required: true },
		client: { type: String, required: true },
		date: { type: Date, required: true },

		// Narrative details
		attendanceLocation: { type: String, required: true },
		attendanceTime: { type: String, required: true },
		attendanceDate: { type: Date, required: true },
		operationType: {
			type: String,
			enum: ["discharge", "loading"],
			required: true,
		},

		// Checklist states
		conditionClean: { type: Boolean, default: false },
		conditionDry: { type: Boolean, default: false },
		conditionOdorFree: { type: Boolean, default: false },

		// Technical cleaning fields
		pipelineConstructionMaterial: {
			type: String,
			enum: ["Steam", "Mild", "Coated"],
			required: true,
		},
		reportedPreviousContent: { type: String, required: true },
		methodsOfCleaning: { type: String, required: true },
		remarks: { type: String, required: true },
		intertekInspector: { type: String, required: true },

		// Dynamic operational signers array
		representatives: [
			{
				name: String,
				id: String,
				email: String,
			},
		],

		// Secure unique profile linkage reference token
		userRef: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const PipelineInspectionReport = mongoose.model(
	"PipelineInspectionReport",
	pipelineInspectionReportSchema,
);
module.exports = PipelineInspectionReport;
