const mongoose = require("mongoose");
const WeighBridge = require("../models/weighBridgeModel.js");
const handlerFactory = require("./handlerFactory.js");

// 1. Updated from saveWeighBridge to saveWeighBridgeReport
exports.saveWeighBridgeReport = handlerFactory.saveDocument(WeighBridge);

// 2. Updated from getAllWeighBridges to getAllWeighBridgeReports
exports.getAllWeighBridgeReports = async (request, response, next) => {
	try {
		const userId = request.user.id;
		const documents = await WeighBridge.find({ userReference: userId }).sort({
			updatedAt: -1,
		});
		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Updated from getWeighBridgeById to getWeighBridgeReport
exports.getWeighBridgeReport = async (request, response, next) => {
	try {
		const documentId = request.params.id;
		const report = await WeighBridge.findById(documentId);

		if (!report) {
			return response
				.status(404)
				.json({ success: false, message: "Report not found" });
		}

		if (report.userReference.toString() !== request.user.id) {
			return response
				.status(403)
				.json({ success: false, message: "Unauthorized access" });
		}

		response.status(200).json(report);
	} catch (error) {
		next(error);
	}
};

// 4. Updated from getAllUsersDocuments to getEveryonesWeighBridgeReports
exports.getEveryonesWeighBridgeReports = async (request, response, next) => {
	try {
		const documents = await WeighBridge.find()
			.populate("userReference", "username avatar")
			.sort({ updatedAt: -1 });

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
