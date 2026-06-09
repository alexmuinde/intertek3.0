// Import the Mongoose library to create our database schema and model
const mongoose = require("mongoose");

// Sub-schema designed to track repeatable representative sign-offs as grouped objects
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Vessel Experience Factor mirroring the Weighbridge standard
const vesselExperienceFactorSchema = new mongoose.Schema(
	{
		// A reference connecting this document to the User account that created it
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Top Level Document Parameters
		vesselName: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		portName: { type: String, required: true },

		// Parallel Primitive Dynamic Lists for Voyage Records
		voyageNumbers: { type: [String], required: true },
		datesOfVoyages: { type: [String], required: true },
		loadPorts: { type: [String], required: true },
		cargoDescriptions: { type: [String], required: true },
		shipsFigures: { type: [Number], required: true },
		shoreFigures: { type: [Number], required: true },
		ratiosShipShore: { type: [Number], required: true },
		isQualifyingVoyages: { type: [String], required: true },

		// Summary Calculations Group
		shipsFigureTotals: { type: Number, required: true },
		shoreFigureTotals: { type: Number, required: true },
		averageRatio: { type: Number, required: true },
		upperLimit: { type: Number, required: true },
		lowerLimit: { type: Number, required: true },
		shipsQualifyingTotals: { type: Number, required: true },
		shoreQualifyingTotals: { type: Number, required: true },
		vesselExperienceFactor: { type: Number, required: true },

		// Sign-off Legal Metadata
		intertekInspector: { type: String, required: true },

		// Refactored Grouped Representatives Array List
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true }, // Automatically manages createdAt and updatedAt
);

// Compile the schema into a Mongoose Model named 'VesselExperienceFactor'
const VesselExperienceFactor = mongoose.model(
	"VesselExperienceFactor",
	vesselExperienceFactorSchema,
);

module.exports = VesselExperienceFactor;

/**const mongoose = require("mongoose");

const vesselExperienceFactorSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		port: { type: String, required: true },
		date: { type: Date, required: true },
		// 1. Voyage Entry Section
		voyages: [
			{
				voyageNo: String,
				date: Date,
				loadPort: String,
				cargo: String,
				shipFig: Number,
				shoreFig: Number,
				ratio: String,
				qual: { type: String, default: "y" },
			},
		],
		// 2. Summary Calculations Section (Read-Only fields from Frontend)
		shipTotal: { type: String, default: "0" },
		shoreTotal: { type: String, default: "0" },
		avgRatio: { type: String, default: "0.00000" },
		upperLimit: { type: String, default: "0.00000" },
		lowerLimit: { type: String, default: "0.00000" },
		shipQualTotal: { type: String, default: "0" },
		shoreQualTotal: { type: String, default: "0" },
		vesselExperienceFactor: { type: String, default: "0.00000" },

		// 3. Personnel Section
		inspectorName: { type: String, required: true },
		representatives: [
			{
				name: String,
				id: String,
				email: String,
			},
		],
		// Authentication Reference
		userRef: {
			type: mongoose.Schema.Types.ObjectId, // MUST be ObjectId, not String
			ref: "User", // MUST match your User model name
			required: true,
		},
	},
	{ timestamps: true },
);

const VesselExperienceFactor = mongoose.model(
	"VesselExperienceFactor",
	vesselExperienceFactorSchema,
);

module.exports = VesselExperienceFactor;
 */
