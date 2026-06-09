const mongoose = require("mongoose");

const rtwsSafetyChecklistSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		intertekInspector: { type: String, required: true },
		timeOfInspection: { type: String, required: true },
		dateOfInspection: { type: String, required: true },
		placeOfInspection: { type: String, required: true },
		clientName: { type: String, required: true },

		truckNumber: { type: String, required: true },
		transporterCompany: { type: String, required: true },
		driversName: { type: String, required: true },
		previousCargo: { type: String, required: true },
		driversIdentification: { type: String, required: true },
		cargoToLoad: { type: String, required: true },

		// Dynamic Array for Multi-Compartment Capacities (Litres)
		compartmentCapacities: { type: [Number], required: true },

		// AUTO-CALCULATED READ-ONLY GRAND TOTAL PROPERTY
		totalCompartmentCapacity: { type: Number, required: true },

		// Checklist Questions (All 27 items stored as explicit Booleans)
		hasNoPreviousLeaks: { type: Boolean, required: true },
		hasSeatBeltsFitted: { type: Boolean, required: true },
		areSeatBeltsMaintained: { type: Boolean, required: true },
		hasSpeedGovernorCertificate: { type: Boolean, required: true },
		hasFireExtinguisher: { type: Boolean, required: true },
		hasSafetyToolsAndSpareWheel: { type: Boolean, required: true },
		hasStoppersFitted: { type: Boolean, required: true },
		areTiresFreeFromWear: { type: Boolean, required: true },
		wasRiskAssessmentCarriedOut: { type: Boolean, required: true },
		wereAllDocumentsChecked: { type: Boolean, required: true },
		wereCapsAndValvesRemoved: { type: Boolean, required: true },
		areCompartmentsCleanDryOdorFree: { type: Boolean, required: true },
		areTopSurfacesCleanAndSafe: { type: Boolean, required: true },
		wereUndersideHatchesInspected: { type: Boolean, required: true },
		werePersonalProtectiveEquipmentUsed: { type: Boolean, required: true },
		wasRagTestPerformed: { type: Boolean, required: true },
		areInternalSurfacesCleanDryOdorFree: { type: Boolean, required: true },
		wereCoamingAreasInspected: { type: Boolean, required: true },
		wasCertificateStatusCompleted: { type: Boolean, required: true },
		wereRejectionReasonsStipulated: { type: Boolean, required: true },
		wasCertificateDulyFilled: { type: Boolean, required: true },
		wasCertificateCopyRetained: { type: Boolean, required: true },
		wasSamePreviousCargoConfirmed: { type: Boolean, required: true },
		wasForeignProductAbsenceVerified: { type: Boolean, required: true },
		wasSecondOpinionSought: { type: Boolean, required: true },
		wereDipsticksVerifiedAtInspection: { type: Boolean, required: true },
		wereDipsticksVerifiedAtGantry: { type: Boolean, required: true },
	},
	{ timestamps: true },
);

const RtwsSafetyChecklist = mongoose.model(
	"RtwsSafetyChecklist",
	rtwsSafetyChecklistSchema,
);
module.exports = RtwsSafetyChecklist;
