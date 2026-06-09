// Import the Mongoose library to create our database schema and model
const mongoose = require("mongoose");

// Grouped sub-schema for witness verification details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for the Statement of Facts marine inspection report
const statementOfFactsSchema = new mongoose.Schema(
	{
		// A reference connecting this document to the User account that created it
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Document Logistics Context
		vesselName: { type: String, required: true },
		portName: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		cargoDescription: { type: String, required: true },

		// Parallel Primitive Dynamic Lists (The "Add More..." chronology log timelines)
		datesOfEvents: { type: [String], required: true },
		timesOfEvents: { type: [String], required: true },
		eventRemarks: { type: [String], required: true },

		// Sign-off Legal Metadata
		intertekInspector: { type: String, required: true },

		// Refactored Grouped Representatives Array List
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true }, // Automatically manages createdAt and updatedAt
);

// Compile the schema into a Mongoose Model named 'StatementOfFacts'
const StatementOfFacts = mongoose.model(
	"StatementOfFacts",
	statementOfFactsSchema,
);

module.exports = StatementOfFacts;
