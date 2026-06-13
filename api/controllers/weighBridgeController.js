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

		// Dynamically compute ownership status instead of blocking with a 403 error
		const isOwner = report.userReference.toString() === request.user.id;

		// Return the standardized structure matching your frontend logic
		response.status(200).json({
			success: true,
			isOwner,
			report
		});
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

exports.checkWeighBridgeOwnership = async (request, response, next) => {
	try {
		// If the request body contains a document ID, it means the user is trying to update an existing report
		const documentId = request.body.id || request.params.id;
		
		if (documentId) {
			const existingReport = await WeighBridge.findById(documentId);
			
			if (existingReport) {
				// Verify if the userReference on the database record matches the active request token ID
				if (existingReport.userReference.toString() !== request.user.id) {
					return response.status(403).json({ 
						success: false, 
						message: "Unauthorized: You can only modify documents that you compiled." 
					});
				}
			}
		} else {
			// If it's a completely new document being instantiated, automatically inject the current user's ID
			request.body.userReference = request.user.id;
		}
		
		next();
	} catch (error) {
		next(error);
	}
};