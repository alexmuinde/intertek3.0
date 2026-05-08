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
			type: String, // Or mongoose.Schema.Types.ObjectId if referencing User model
			required: true,
		},
	},
	{ timestamps: true },
);

const StatementOfFacts = mongoose.model("StatementOfFacts", sofSchema);
module.exports = StatementOfFacts;
