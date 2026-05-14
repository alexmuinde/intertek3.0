const mongoose = require("mongoose");

const letterOfProtestGeneralSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		date: { type: Date, required: true },
		berthNumber: { type: String, required: true },
		shipTanks: { type: String, required: true },
		gradeBillOfLading: { type: String, required: true },

		// Sub-document array tracking individual remarks strings
		remarksEntries: [
			{
				remarkText: String,
			},
		],

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

const LetterOfProtestGeneral = mongoose.model(
	"LetterOfProtestGeneral",
	letterOfProtestGeneralSchema,
);
module.exports = LetterOfProtestGeneral;
