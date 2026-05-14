const mongoose = require("mongoose");

const dischargeProcedureSequenceSchema = new mongoose.Schema(
	{
		vessel: { type: String, required: true },
		date: { type: Date, required: true },
		port: { type: String, required: true },
		grade: { type: String, required: true },
		berth: { type: String, required: true },

		// Sub-array component structure tracking sequence parcel objects
		proceduralSteps: [
			{
				shoreline: String,
				client: String,
				stepGrade: String,
				billOfLading: String,
				shipsTanks: String,
				shoreTanks: String,
				stepRemarks: String,
			},
		],

		pressureModifier: {
			type: String,
			enum: ["minimum", "maximum"],
			required: true,
		},
		manifoldPressureBars: { type: String, required: true },

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

const DischargeProcedureSequence = mongoose.model(
	"DischargeProcedureSequence",
	dischargeProcedureSequenceSchema,
);
module.exports = DischargeProcedureSequence;
