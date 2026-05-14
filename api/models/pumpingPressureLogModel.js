const mongoose = require("mongoose");

const pumpingPressureLogSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		port: { type: String, required: true },
		date: { type: Date, required: true },
		cargo: { type: String, required: true },

		// Hourly sub-document time entry array logs
		pressureLogs: [
			{
				logDate: Date,
				logTime: String,
				manifoldPressure: String,
			},
		],

		minimumRequestedPressure: { type: String, required: true },
		maximumRequestedPressure: { type: String, required: true },

		intertekInspector: { type: String, required: true },

		// Consistent operational witness verification signature structures
		representatives: [
			{
				name: String,
				id: String,
				email: String,
			},
		],

		// Core secure identity tracker link reference token
		userRef: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const PumpingPressureLog = mongoose.model(
	"PumpingPressureLog",
	pumpingPressureLogSchema,
);
module.exports = PumpingPressureLog;
