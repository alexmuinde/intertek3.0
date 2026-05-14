const mongoose = require("mongoose");

const rtwsSafetyChecklistSchema = new mongoose.Schema(
	{
		intertekInspectorName: { type: String, required: true },
		timeOfInspection: { type: String, required: true },
		dateOfInspection: { type: Date, required: true },
		placeOfInspection: { type: String, required: true },
		client: { type: String, required: true },
		truckNumber: { type: String, required: true },
		transporter: { type: String, required: true },
		driversName: { type: String, required: true },
		previousCargo: { type: String, required: true },
		driversId: { type: String, required: true },
		toLoad: { type: String, required: true },

		// Dynamic compartmental sub-document tracking space
		compartments: [
			{
				compartmentNumber: String,
			},
		],

		// Auto-calculated capacity sum string tracking metric
		totalCapacity: { type: String, default: "0" },

		// All 27 verification items mapped
		checkItem1: { type: Boolean, default: false },
		checkItem2: { type: Boolean, default: false },
		checkItem3: { type: Boolean, default: false },
		checkItem4: { type: Boolean, default: false },
		checkItem5: { type: Boolean, default: false },
		checkItem6: { type: Boolean, default: false },
		checkItem7: { type: Boolean, default: false },
		checkItem8: { type: Boolean, default: false },
		checkItem9: { type: Boolean, default: false },
		checkItem10: { type: Boolean, default: false },
		checkItem11: { type: Boolean, default: false },
		checkItem12: { type: Boolean, default: false },
		checkItem13: { type: Boolean, default: false },
		checkItem14: { type: Boolean, default: false },
		checkItem15: { type: Boolean, default: false },
		checkItem16: { type: Boolean, default: false },
		checkItem17: { type: Boolean, default: false },
		checkItem18: { type: Boolean, default: false },
		checkItem19: { type: Boolean, default: false },
		checkItem20: { type: Boolean, default: false },
		checkItem21: { type: Boolean, default: false },
		checkItem22: { type: Boolean, default: false },
		checkItem23: { type: Boolean, default: false },
		checkItem24: { type: Boolean, default: false },
		checkItem25: { type: Boolean, default: false },
		checkItem26: { type: Boolean, default: false },
		checkItem27: { type: Boolean, default: false },

		// Core authority session profile binding validation reference
		userRef: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const RtwsSafetyChecklist = mongoose.model(
	"RtwsSafetyChecklist",
	rtwsSafetyChecklistSchema,
);
module.exports = RtwsSafetyChecklist;
