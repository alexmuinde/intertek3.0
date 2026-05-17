const mongoose = require("mongoose");

// Grouped sub-schema for witness verification details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Letter of Protest Shore Final Outturn Figures
const letterOfProtestShoreFinalOutturnFiguresSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Context Parameters
		recipientName: { type: String, required: true },
		vesselName: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		cargoGrade: { type: String, required: true },
		portName: { type: String, required: true },

		// Inline Paragraph Parameter
		dateOfProvisionalProtestReport: { type: String, required: true },

		// Parallel Primitive Dynamic Lists tracking product calculations ("Add More..." entries)
		billOfLadingFigures: { type: [Number], required: true },
		shoreFinalOutturnFigures: { type: [Number], required: true },
		metricTonsDifferences: { type: [Number], required: true },
		percentageDifferences: { type: [Number], required: true },

		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list compiled at the end anchor
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const LetterOfProtestShoreFinalOutturnFigures = mongoose.model(
	"LetterOfProtestShoreFinalOutturnFigures",
	letterOfProtestShoreFinalOutturnFiguresSchema,
);
module.exports = LetterOfProtestShoreFinalOutturnFigures;
