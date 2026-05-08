const mongoose = require("mongoose");
const WheighBridge = require("../models/wheighBridgeModel.js");
const factory = require("./handlerFactory.js");

exports.saveWheighBridge = factory.saveDocument(WheighBridge);

// Example for getting all user WeighBridges
exports.getAllWheighBridges = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const documents = await WheighBridge.find({ userRef: userId }).sort({
			updatedAt: -1,
		}); // -1 means newest first
		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

exports.getWheighBridge = async (req, res, next) => {
	try {
		const report = await WheighBridge.findById(req.params.id);
		if (!report)
			return res
				.status(404)
				.json({ success: false, message: "Report not found" });

		// Add this security check
		if (report.userRef.toString() !== req.user.id) {
			return res
				.status(403)
				.json({ success: false, message: "Unauthorized access" });
		}

		res.status(200).json(report);
	} catch (error) {
		next(error);
	}
};

// Create a new public fetcher
exports.getEveryonesDocs = async (req, res, next) => {
	try {
		// Change 'Model' to 'WheighBridge'
		const documents = await WheighBridge.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });
		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
