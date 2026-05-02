const { default: wheighBridge } = require("../models/wheighBridgeModel.js");

// Export the function using CommonJS 'exports' syntax
exports.createWheighBridge = async (req, res, next) => {
	// Start a try-catch block to handle asynchronous database operations
	try {
		// Logic: You will add your WeighBridge.create(req.body) logic here
		const wheighBridge = await wheighBridge.create(req.body);
		return res.status(201).json(wheighBridge);
	} catch (error) {
		// Logic: If any error occurs, pass it to the global error middleware
		next(error);
	}
};

/**export const createWheighBridge = async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
};
 */
