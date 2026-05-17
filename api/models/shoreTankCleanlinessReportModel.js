const mongoose = require("mongoose");

// Grouped sub-schema for terminal/client witness verification details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Shore Tank Cleanliness Inspection Reports
const shoreTankCleanlinessReportSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Parameters
		vesselName: { type: String, required: true },
		cargoDescription: { type: String, required: true },
		clientName: { type: String, required: true },
		dateOfReport: { type: String, required: true },

		// Attendance Narrative Paragraph Inputs
		attendanceLocation: { type: String, required: true },
		timeOfAttendance: { type: String, required: true },
		dateOfAttendance: { type: String, required: true },
		inspectedTankNumber: { type: String, required: true },
		productToReceive: { type: String, required: true },

		// Condition Checkboxes Map (Stored as strict Booleans)
		isInternalSurfaceClean: { type: Boolean, required: true },
		isInternalSurfaceDry: { type: Boolean, required: true },
		isInternalSurfaceOdorFree: { type: Boolean, required: true },

		// Material Selection & Technical Properties
		tankConstructionMaterial: {
			type: String,
			required: true,
			enum: ["Steam", "Mild", "Coated"],
		},
		reportedPreviousContent: { type: String, required: true },
		methodsOfCleaning: { type: String, required: true },

		measurementRemarks: { type: String, required: true },
		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const ShoreTankCleanlinessReport = mongoose.model(
	"ShoreTankCleanlinessReport",
	shoreTankCleanlinessReportSchema,
);
module.exports = ShoreTankCleanlinessReport;
