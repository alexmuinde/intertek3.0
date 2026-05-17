const mongoose = require("mongoose");

// Grouped sub-schema for witness verification details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Letter of Protest - General
const letterOfProtestGeneralSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Context Parameters
		vesselName: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		berthNumber: { type: String, required: true },
		shipTanks: { type: String, required: true },
		cargoGradeBillOfLading: { type: String, required: true },

		// Parallel Primitive Dynamic Lists for multiple protest items
		protestRemarks: { type: [String], required: true },

		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list compiled at the end anchor
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const LetterOfProtestGeneral = mongoose.model(
	"LetterOfProtestGeneral",
	letterOfProtestGeneralSchema,
);
module.exports = LetterOfProtestGeneral;
