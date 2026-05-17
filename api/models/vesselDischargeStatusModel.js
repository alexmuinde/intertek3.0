const mongoose = require("mongoose");

// Grouped sub-schema for witness verification details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

const vesselDischargeStatusSchema = new mongoose.Schema(
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

		// Parallel Dynamic Primitive Lists (The "Add More..." log entries)
		datesOfLogEntries: { type: [String], required: true },
		timesOfLogEntries: { type: [String], required: true },
		manifoldNumbers: { type: [String], required: true },
		manifoldPressures: { type: [String], required: true }, // Kept as String to accommodate pressure units (bar, psi, etc.)
		cargoTemperatures: { type: [Number], required: true },
		remainingOnBoardQuantities: { type: [Number], required: true },
		dischargeQuantities: { type: [Number], required: true },
		dischargeRates: { type: [Number], required: true },

		remarks: { type: String, required: true },
		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const VesselDischargeStatus = mongoose.model(
	"VesselDischargeStatus",
	vesselDischargeStatusSchema,
);
module.exports = VesselDischargeStatus;
