const PipelineInspectionReport = require("../models/pipelineInspectionReportModel.js");
const handlerFactory = require("./handlerFactory.js");

// Save or Update a pipeline document using the centralized factory framework blueprint
exports.savePipelineInspectionReport = handlerFactory.saveDocument(
	PipelineInspectionReport,
);

// Retrieve all reports created by the currently logged-in user session
exports.getAllPipelineInspectionReports = async (request, response, next) => {
	try {
		const userId = request.user.id;
		const documents = await PipelineInspectionReport.find({
			userReference: userId,
		}).sort({
			updatedAt: -1,
		});
		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// Retrieve a single specific report by ID with secure account validation
exports.getPipelineInspectionReport = async (request, response, next) => {
	try {
		const documentId = request.params.id;
		const report = await PipelineInspectionReport.findById(documentId);

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

// Public/Admin endpoint to fetch every pipeline log entry inside the system database
exports.getEveryonesPipelineInspectionReports = async (
	request,
	response,
	next,
) => {
	try {
		const documents = await PipelineInspectionReport.find()
			.populate("userReference", "username avatar")
			.sort({ updatedAt: -1 });

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
