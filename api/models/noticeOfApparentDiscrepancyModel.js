const mongoose = require("mongoose");

const noticeOfApparentDiscrepancySchema = new mongoose.Schema(
	{
		toAddress: { type: String, required: true },
		vessel: { type: String, required: true },
		date: { type: Date, required: true },
		grade: { type: String, required: true },
		port: { type: String, required: true },

		// Section 1 Parameters
		billOfLading: { type: String, required: true },
		shipsFigureMombasa1: { type: String, required: true },
		difference1: { type: String, required: true },
		percentageDifference1: { type: String, required: true },

		// Section 2 Parameters
		figuresLoadPort: { type: String, required: true },
		shipsFigureMombasa2: { type: String, required: true },
		difference2: { type: String, required: true },
		percentageDifference2: { type: String, required: true },

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

const NoticeOfApparentDiscrepancy = mongoose.model(
	"NoticeOfApparentDiscrepancy",
	noticeOfApparentDiscrepancySchema,
);
module.exports = NoticeOfApparentDiscrepancy;
