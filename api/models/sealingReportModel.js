const mongoose = require("mongoose");

const sealingReportSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		port: { type: String, required: true },
		date: { type: Date, required: true },
		cargo: { type: String, required: true },
		// Changed 'entries' to 'seals' to match your report logic
		seals: [
			{
				location: String,
				sealNumber: String,
			},
		],
		inspectorName: { type: String, required: true },
		representatives: [
			{
				name: String,
				id: String,
				email: String,
			},
		],
		// Links the report to the specific Intertek inspector
		userRef: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

const SealingReport = mongoose.model("SealingReport", sealingReportSchema);
module.exports = SealingReport;
