const mongoose = require("mongoose");

const vesselDischargeStatusSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		date: { type: Date, required: true },
		berthNumber: { type: String },
		shipTanks: { type: String },
		gradeBl: { type: String },
		dischargeLogs: [
			{
				date: String,
				time: String,
				manifoldNo: String,
				pressure: String,
				temp: String,
				rob: String,
				qty: String,
				rate: String,
			},
		],
		remarks: { type: String },
		inspectorName: { type: String, required: true },
		representatives: [
			{
				name: String,
				id: String,
				email: String,
			},
		],
		userRef: {
			type: mongoose.Schema.Types.ObjectId, // MUST be ObjectId, not String
			ref: "User", // MUST match your User model name
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model(
	"VesselDischargeStatus",
	vesselDischargeStatusSchema,
);
