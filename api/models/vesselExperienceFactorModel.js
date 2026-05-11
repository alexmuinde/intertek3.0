const mongoose = require("mongoose");

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
			type: String,
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
