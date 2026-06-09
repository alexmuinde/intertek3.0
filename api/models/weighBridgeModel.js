// Import the Mongoose library to create our database schema and model
const mongoose = require("mongoose");

// Define the comprehensive schema for a Weighbridge Inspection Report
const weighBridgeSchema = new mongoose.Schema(
	{
		// A reference connecting this document to the User account that created it
		userReference: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		intertekSurveyor: { type: String, required: true },
		placeOfLoading: { type: String, required: true },
		client: { type: String, required: true },
		transportCompany: { type: String, required: true },
		dateOfLoading: { type: String, required: true },
		timeOfInspection: { type: String, required: true },
		truckCommencedLoading: { type: String, required: true },
		truckCompletedLoading: { type: String, required: true },
		vessel: { type: String, required: true },
		grade: { type: String, required: true },
		density: { type: String, required: true },
		shoreTankNumber: { type: String, required: true },
		temperature: { type: Number, required: true },
		constructionMaterial: { type: String, required: true },
		truckNumber: { type: String, required: true },
		driversName: { type: String, required: true },
		driversIdentification: { type: String, required: true },
		grossWeight: { type: Number, required: true },
		tareWeight: { type: Number, required: true },
		netWeight: { type: Number, required: true },
		cumulativeWeight: { type: Number, required: true },
		weighbridgeReceipt: { type: Number, required: true },
		previousCargo: { type: String, required: true },
		trackSealedBy: { type: String, required: true },
		bottomSeals: { type: [String], required: true },
		topSeals: { type: [String], required: true },
		isClean: { type: Boolean, required: true },
		hasSpareWheel: { type: Boolean, required: true },
		waterContainerEmpty: { type: Boolean, required: true },
		isVehicleEmpty: { type: Boolean, required: true },
		nothingAttached: { type: Boolean, required: true },
	},
	{ timestamps: true }, // Automatically adds and manages createdAt and updatedAt fields
);

// Compile the schema into a Mongoose Model named 'WeighBridge'
const WeighBridge = mongoose.model("WeighBridge", weighBridgeSchema);

// Export the model for use within your controller files
module.exports = WeighBridge;

/**const mongoose = require("mongoose");

// 1. Workflow: Schema covering Logistics, Technicals, Weights, and Checklists
const wheighBridgeSchema = new mongoose.Schema(
	{
		userRef: { type: String, required: true },
		intertekSurveyor: { type: String, required: true },
		placeOfLoading: { type: String, required: true },
		client: { type: String, required: true },
		transportCompany: { type: String, required: true },
		dateOfLoading: { type: String, required: true },
		timeOfInspection: { type: String, required: true },
		truckCommencedLoading: { type: String, required: true },
		truckCompletedLoading: { type: String, required: true },
		vessel: { type: String, required: true },
		grade: { type: String, required: true },
		density: { type: String, required: true },
		shoreTankNo: { type: String, required: true },
		temperature: { type: Number, required: true },
		constructionMaterial: { type: String, required: true },
		truckNumber: { type: String, required: true },
		driversName: { type: String, required: true },
		driversId: { type: String, required: true },
		grossWeight: { type: Number, required: true },
		tareWeight: { type: Number, required: true },
		nettWeight: { type: Number, required: true },
		cumulativeWeight: { type: Number, required: true },
		weighbridgeReceipt: { type: Number, required: true },
		previousCargo: { type: String, required: true },
		trackSealedBy: { type: String, required: true },
		bottomSeals: { type: [String], required: true },
		topSeals: { type: [String], required: true },
		// Checkbox Booleans
		isClean: { type: Boolean, required: true },
		hasSpareWheel: { type: Boolean, required: true },
		waterContainerEmpty: { type: Boolean, required: true },
		isVehicleEmpty: { type: Boolean, required: true },
		nothingAttached: { type: Boolean, required: true },
	},
	{ timestamps: true },
);

const WheighBridge = mongoose.model("WheighBridge", wheighBridgeSchema);
module.exports = WheighBridge;
 */
