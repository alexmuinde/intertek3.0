const mongoose = require("mongoose");

const sofSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		port: { type: String, required: true },
		date: { type: Date, required: true },
		cargo: { type: String, required: true },
		entries: [
			{
				date: String,
				time: String,
				remarks: String,
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
		// --- THE USER REFERENCE FIELD ---
		userRef: {
			type: mongoose.Schema.Types.ObjectId, // MUST be ObjectId, not String
			ref: "User", // MUST match your User model name
			required: true,
		},
	},
	{ timestamps: true },
);

const StatementOfFacts = mongoose.model("StatementOfFacts", sofSchema);
module.exports = StatementOfFacts;
