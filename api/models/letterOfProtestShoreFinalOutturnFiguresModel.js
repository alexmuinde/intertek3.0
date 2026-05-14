const mongoose = require("mongoose");

const letterOfProtestShoreFinalOutturnFiguresSchema = new mongoose.Schema(
	{
		toAddress: { type: String, required: true },
		vessel: { type: String, required: true },
		date: { type: Date, required: true },
		grade: { type: String, required: true },
		port: { type: String, required: true },

		// Narrative conditional criteria fields
		shoreProvisionalProtestDate: { type: Date, required: true },

		// Mathematical quantification parameters
		billOfLadingFigure: { type: String, required: true },
		shoreFinalOutturnFigure: { type: String, required: true },
		difference: { type: String, required: true },
		percentageDifference: { type: String, required: true },

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

const LetterOfProtestShoreFinalOutturnFigures = mongoose.model(
	"LetterOfProtestShoreFinalOutturnFigures",
	letterOfProtestShoreFinalOutturnFiguresSchema,
);
module.exports = LetterOfProtestShoreFinalOutturnFigures;
