// Import the mongoose library to define the structure of your database documents
const mongoose = require("mongoose");

// Define the blueprint (Schema) for a WeighBridge record
const wheighBridgeSchema = new mongoose.Schema(
	{
		// Name of the surveyor; required to ensure accountability
		intertekSurveyor: {
			type: String,
			required: true,
		},
		// Location where the goods are being picked up
		placeOfLoading: {
			type: String,
			required: true,
		},
		// The company or individual paying for the service
		client: {
			type: String,
			required: true,
		},
		// The logistics provider moving the goods
		transportCompany: {
			type: String,
			required: true,
		},
		userRef: {
			type: String,
			required: true,
		},
	},
	// Automatically adds 'createdAt' and 'updatedAt' fields to each document
	{ timestamps: true },
);

// Create a Model named 'WheighBridge' based on the schema above
const WheighBridge = mongoose.model("WheighBridge", wheighBridgeSchema);

// Export the model using CommonJS so it can be 'require'd in your controller
module.exports = WheighBridge;
