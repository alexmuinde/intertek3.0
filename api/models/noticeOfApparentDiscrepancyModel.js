const mongoose = require("mongoose");

// Grouped sub-schema for witness verification details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Notice of Apparent Discrepancy
const noticeOfApparentDiscrepancySchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Parameters
		recipientName: { type: String, required: true },
		vesselName: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		cargoGrade: { type: String, required: true },
		portName: { type: String, required: true },

		// Parallel Primitive Dynamic Lists: Section 1 - Bill of Lading vs Ships Figure
		billOfLadingFigures: { type: [Number], required: true },
		shipsFiguresAtDischargePort: { type: [Number], required: true },
		billOfLadingMetricTonsDifferences: { type: [Number], required: true },
		billOfLadingPercentageDifferences: { type: [Number], required: true },

		// Parallel Primitive Dynamic Lists: Section 2 - Load Port vs Ships Figure
		loadPortFigures: { type: [Number], required: true },
		shipsFiguresAtMombasa: { type: [Number], required: true },
		loadPortMetricTonsDifferences: { type: [Number], required: true },
		loadPortPercentageDifferences: { type: [Number], required: true },

		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list compiled at the end
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const NoticeOfApparentDiscrepancy = mongoose.model(
	"NoticeOfApparentDiscrepancy",
	noticeOfApparentDiscrepancySchema,
);
module.exports = NoticeOfApparentDiscrepancy;
