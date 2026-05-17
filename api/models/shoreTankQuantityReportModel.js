// Import the Mongoose library to create our database schema and model
const mongoose = require("mongoose");

// Grouped sub-schema for witness verification details
const representativeSchema = new mongoose.Schema({
	representativeName: { type: String, required: true },
	representativeIdentification: { type: String, required: true },
	representativeEmail: { type: String, required: true },
});

// Comprehensive schema for Shore Tank Quantity Report with dynamic measurement columns
const shoreTankQuantityReportSchema = new mongoose.Schema(
	{
		// A reference connecting this document to the User account that created it
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Core Identity Context Parameters
		dateOfReport: { type: String, required: true },
		vesselName: { type: String, required: true },
		portName: { type: String, required: true },
		installationName: { type: String, required: true },
		productDescription: { type: String, required: true },
		operationType: { type: String, required: true },

		// REFACTORED: Parallel Dynamic Arrays for Multiple Tank Measurements
		overallDipMillimeters: { type: [Number], required: true },
		productDipMillimeters: { type: [Number], required: true },
		tankTemperatures: { type: [Number], required: true },
		densityValues: { type: [Number], required: true },
		observedVolumeLiters: { type: [Number], required: true },
		weightMetricTonsInAir: { type: [Number], required: true },
		datesOfMeasurements: { type: [String], required: true },
		timesOfMeasurements: { type: [String], required: true },
		measurementRemarks: { type: [String], required: true },

		// Dynamic Selector and Calculation Fields
		densityTemperatureBasis: { type: String, required: true },
		coefficientFactor: { type: Number, required: true },

		// Equipment Calibration Group
		dippingTapeSerialNumber: { type: String, required: true },
		dippingTapeCalibrationCertificateNumber: { type: String, required: true },
		dippingTapeExpiryDate: { type: String, required: true },
		thermometerSerialNumber: { type: String, required: true },
		thermometerCalibrationCertificateNumber: { type: String, required: true },
		thermometerExpiryDate: { type: String, required: true },

		// Authorization & Validation Signatures
		intertekInspector: { type: String, required: true },

		// Grouped repeatable representatives list
		representatives: { type: [representativeSchema], required: true },
	},
	{ timestamps: true },
);

const ShoreTankQuantityReport = mongoose.model(
	"ShoreTankQuantityReport",
	shoreTankQuantityReportSchema,
);

module.exports = ShoreTankQuantityReport;
