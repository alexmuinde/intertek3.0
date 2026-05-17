const mongoose = require("mongoose");

// Grouped sub-schema for witness validation details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Pumping Pressure Log marine survey files
const pumpingPressureLogSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Context Parameters
		vesselName: { type: String, required: true },
		portName: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		cargoDescription: { type: String, required: true },

		// Parallel Dynamic Primitive Lists (The "Add More..." log rows)
		datesOfLogEntries: { type: [String], required: true },
		timesOfLogEntries: { type: [String], required: true },
		manifoldPressures: { type: [String], required: true }, // Kept as String to allow unit suffixes (bar, psi)

		// Shore Pressure Request Bounds Parameters
		minimumRequestedPressure: { type: String, required: true },
		maximumRequestedPressure: { type: String, required: true },

		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list compiled at the base anchor
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const PumpingPressureLog = mongoose.model(
	"PumpingPressureLog",
	pumpingPressureLogSchema,
);
module.exports = PumpingPressureLog;
