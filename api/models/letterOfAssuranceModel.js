const mongoose = require("mongoose");

const letterOfAssuranceSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		toAddress: { type: String, required: true },
		date: { type: Date, required: true },
		grade: { type: String, required: true },
		port: { type: String, required: true },
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

const LetterOfAssurance = mongoose.model(
	"LetterOfAssurance",
	letterOfAssuranceSchema,
);
module.exports = LetterOfAssurance;
