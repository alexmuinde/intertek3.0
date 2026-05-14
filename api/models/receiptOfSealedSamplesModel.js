const mongoose = require("mongoose");

const receiptOfSealedSamplesSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		client: { type: String, required: true },
		portOfLoading: { type: String, required: true },
		date: { type: Date, required: true },
		cargo: { type: String, required: true },

		// Sub-array component structure tracking listed dynamic records
		samples: [
			{
				grade: String,
				sizeOfSamples: String,
				sealNumber: String,
				description: String,
			},
		],

		intertekInspector: { type: String, required: true },

		// Consistently bound verification representatives map array at the bottom of data layer
		representatives: [
			{
				name: String,
				id: String,
				email: String,
			},
		],

		// Profile authority tracker reference token
		userRef: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const ReceiptOfSealedSamples = mongoose.model(
	"ReceiptOfSealedSamples",
	receiptOfSealedSamplesSchema,
);
module.exports = ReceiptOfSealedSamples;
