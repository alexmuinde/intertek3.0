const HandOverReport = require("../models/handOverReportModel.js");
const handlerFactory = require("./handlerFactory.js");

// Save or Update a handover document entry using the factory handler blueprint
exports.saveHandOverReport = handlerFactory.saveDocument(HandOverReport);

// Retrieve all reports created by the currently logged-in user session
exports.getAllHandOverReports = async (request, response, next) => {
	try {
		const userId = request.user.id;
		const documents = await HandOverReport.find({ userReference: userId }).sort(
			{
				updatedAt: -1,
			},
		);
		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// Retrieve a single specific report by ID with secure account reference validation
exports.getHandOverReport = async (request, response, next) => {
	try {
		const documentId = request.params.id;
		const report = await HandOverReport.findById(documentId);

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

// Public/Admin endpoint to fetch every transition log entry inside the system database
exports.getEveryonesHandOverReports = async (request, response, next) => {
	try {
		const documents = await HandOverReport.find()
			.populate("userReference", "username avatar")
			.sort({ updatedAt: -1 });

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
