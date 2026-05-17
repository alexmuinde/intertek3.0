const PumpingPressureLog = require("../models/pumpingPressureLogModel.js");
const handlerFactory = require("./handlerFactory.js");

// Save or Update a log using the centralized factory framework blueprint
exports.savePumpingPressureLogReport =
	handlerFactory.saveDocument(PumpingPressureLog);

// Retrieve all reports created by the currently logged-in user session
exports.getAllPumpingPressureLogReports = async (request, response, next) => {
	try {
		const userId = request.user.id;
		const documents = await PumpingPressureLog.find({
			userReference: userId,
		}).sort({
			updatedAt: -1,
		});
		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// Retrieve a single specific report by ID with secure token validation checks
exports.getPumpingPressureLogReport = async (request, response, next) => {
	try {
		const documentId = request.params.id;
		const report = await PumpingPressureLog.findById(documentId);

		if (!report) {
			return response
				.status(404)
				.json({ success: false, message: "Report not found" });
		}

		if (report.userReference.toString() !== request.user.id) {
			return response
				.status(403)
				.json({ success: false, message: "Unauthorized access restriction" });
		}

		response.status(200).json(report);
	} catch (error) {
		next(error);
	}
};

// Public/Admin endpoint to fetch every pressure log entry across all active profiles
exports.getEveryonesPumpingPressureLogReports = async (
	request,
	response,
	next,
) => {
	try {
		const documents = await PumpingPressureLog.find()
			.populate("userReference", "username avatar")
			.sort({ updatedAt: -1 });

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
