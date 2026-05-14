const mongoose = require("mongoose");

const letterOfProtestSlowRateSchema = new mongoose.Schema(
	{
		toAddress: { type: String, required: true },
		vessel: { type: String, required: true },
		port: { type: String, required: true },
		date: { type: Date, required: true },
		cargo: { type: String, required: true },

		// Dropdowns & narrative fields
		operationType: {
			type: String,
			enum: ["Discharge", "Loading"],
			required: true,
		},
		commencedAtTime: { type: String, required: true },
		commencedAtDate: { type: Date, required: true },
		completedAtTime: { type: String, required: true },
		completedAtDate: { type: Date, required: true },
		delayType: {
			type: String,
			enum: ["Stoppages", "Suspensions"],
			required: true,
		},
		delayRemarks: { type: String, required: true },

		// Quantity metadata fields
		totalOperationTime: { type: String, required: true },
		totalQuantity: { type: String, required: true },
		calculatedRate: { type: String, required: true },

		intertekInspector: { type: String, required: true },

		representatives: [
			{
				name: String,
				id: String,
				email: String,
			},
		],

		userRef: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const LetterOfProtestSlowRate = mongoose.model(
	"LetterOfProtestSlowRate",
	letterOfProtestSlowRateSchema,
);
module.exports = LetterOfProtestSlowRate;
