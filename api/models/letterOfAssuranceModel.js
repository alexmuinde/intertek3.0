const mongoose = require("mongoose");

// Grouped sub-schema for client/terminal witness credentials
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Letter of Assurance records
const letterOfAssuranceSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Context Parameters
		vesselName: { type: String, required: true },
		recipientName: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		cargoGrade: { type: String, required: true },
		portName: { type: String, required: true },

		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list compiled at the end anchor
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const LetterOfAssurance = mongoose.model(
	"LetterOfAssurance",
	letterOfAssuranceSchema,
);
module.exports = LetterOfAssurance;
