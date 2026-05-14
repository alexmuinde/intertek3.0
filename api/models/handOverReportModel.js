const mongoose = require("mongoose");

const handOverReportSchema = new mongoose.Schema(
	{
		department: { type: String, required: true },
		date: { type: Date, required: true },
		fromStaff: { type: String, required: true },
		toStaff: { type: String, required: true },
		staffHandingOver: { type: String, required: true },
		staffReceivingHandOver: { type: String, required: true },

		// Sub-document array tracking individual responsibility blocks
		responsibilities: [
			{
				responsibilityText: String,
			},
		],

		departmentHead: { type: String, required: true },
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

const HandOverReport = mongoose.model("HandOverReport", handOverReportSchema);
module.exports = HandOverReport;
