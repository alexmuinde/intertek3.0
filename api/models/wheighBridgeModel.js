const mongoose = require("mongoose");

const wheighBridgeSchema = new mongoose.Schema(
	{
		// --- UPDATED USER REFERENCE FIELD ---
		userRef: {
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
