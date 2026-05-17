const mongoose = require("mongoose");

// Grouped sub-schema for representative sign-offs
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Ship's Tanks Ullage Reports
const shipsTanksUllageReportSchema = new mongoose.Schema(
	{
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Context Parameters
		vesselName: { type: String, required: true },
		portName: { type: String, required: true },
		dateOfReport: { type: String, required: true },
		cargoDescription: { type: String, required: true },
		berthNumber: { type: String, required: true },

		// Parallel Dynamic Primitive Lists (The "Add More..." log entries)
		tankNumbers: { type: [String], required: true },
		correctedUllageSoundingMetricTons: { type: [Number], required: true },
		freeWaterDipCentimeters: { type: [Number], required: true },
		volumesAtTankTemperature: { type: [Number], required: true },
		temperatures: { type: [Number], required: true },
		kilogramsPerLitreInAir: { type: [Number], required: true },
		metricTonsInAir: { type: [Number], required: true },

		// Read-Only Auto-Calculated Grand Totals Aggregated by the server
		totalVolume: { type: Number, required: true },
		totalWeight: { type: Number, required: true },

		// Dynamic Custom Calculation Factor Variables
		basisKilogramsPerLitreInAir: { type: Number, required: true },
		basisTemperatureDegrees: { type: Number, required: true },
		temperatureCoefficientFactorPerDegree: { type: Number, required: true },

		// Trim and Marine Sea Conditions Group
		forwardDraft: { type: String, required: true },
		aftDraft: { type: String, required: true },
		vesselList: { type: String, required: true },
		seaCondition: { type: String, required: true },

		// Safety Gauging Equipment Tracking Data
		equipmentType: { type: String, required: true },
		equipmentSerialNumber: { type: String, required: true },
		calibrationCertificateNumber: { type: String, required: true },
		equipmentExpiryDate: { type: String, required: true },

		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const ShipsTanksUllageReport = mongoose.model(
	"ShipsTanksUllageReport",
	shipsTanksUllageReportSchema,
);
module.exports = ShipsTanksUllageReport;
