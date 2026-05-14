const mongoose = require("mongoose");

const shoreTankCleanlinessReportSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		cargo: { type: String, required: true },
		client: { type: String, required: true },
		date: { type: Date, required: true },

		// Narrative details from the statement string
		attendanceLocation: { type: String },
		attendanceTime: { type: String },
		attendanceDate: { type: Date },
		inspectedTankNumber: { type: String },
		productToReceive: { type: String },

		// Surface visual checklists
		conditionClean: { type: Boolean, default: false },
		conditionDry: { type: Boolean, default: false },
		conditionOdorFree: { type: Boolean, default: false },

		// Technical cleaning documentation parameters
		tankConstructionMaterial: {
			type: String,
			enum: ["Steam", "Mild", "Coated"],
			required: true,
		},
		reportedPreviousContent: { type: String, required: true },
		methodsOfCleaning: { type: String, required: true },
		remarks: { type: String, required: true },
		intertekInspector: { type: String, required: true },

		// Nested authorized signers validation array
		representatives: [
			{
				name: String,
				id: String,
				email: String,
			},
		],

		// Identity reference linkage to matching inspector account profile
		userRef: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const ShoreTankCleanlinessReport = mongoose.model(
	"ShoreTankCleanlinessReport",
	shoreTankCleanlinessReportSchema,
);

module.exports = ShoreTankCleanlinessReport;
