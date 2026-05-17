const mongoose = require("mongoose");

// Comprehensive schema for Hand Over Report document data sheets
const handOverReportSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Parameters
		departmentName: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		outgoingStaffName: { type: String, required: true }, // Expanded "From"
		incomingStaffName: { type: String, required: true }, // Expanded "To"

		// Shift Transition Profiles
		staffHandingOverSignature: { type: String, required: true },
		staffReceivingHandOverSignature: { type: String, required: true },

		// REFACTORED: Parallel Dynamic Primitive List for Roles and Actions ("Add More..." entries)
		assignedResponsibilities: { type: [String], required: true },

		// Sign-off Management Authorization
		departmentHeadName: { type: String, required: true },
	},
	{ timestamps: true },
);

const HandOverReport = mongoose.model("HandOverReport", handOverReportSchema);
module.exports = HandOverReport;
