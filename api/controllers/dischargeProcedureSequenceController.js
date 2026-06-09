const DischargeProcedureSequence = require("../models/dischargeProcedureSequenceModel.js");
const handlerFactory = require("./handlerFactory.js");

// Save or Update a report using the centralized factory framework blueprint
exports.saveDischargeProcedureSequenceReport = handlerFactory.saveDocument(
	DischargeProcedureSequence,
);

// Retrieve all reports created by the currently logged-in user session
exports.getAllDischargeProcedureSequenceReports = async (
	request,
	response,
	next,
) => {
	try {
		const userId = request.user.id;
		const documents = await DischargeProcedureSequence.find({
			userReference: userId,
		}).sort({
			updatedAt: -1,
		});
		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// Retrieve a single specific report by ID with secure account reference validation
exports.getDischargeProcedureSequenceReport = async (
	request,
	response,
	next,
) => {
	try {
		const documentId = request.params.id;
		const report = await DischargeProcedureSequence.findById(documentId);

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

// Public/Admin endpoint to fetch every sequence log entry inside the database
exports.getEveryonesDischargeProcedureSequenceReports = async (
	request,
	response,
	next,
) => {
	try {
		const documents = await DischargeProcedureSequence.find()
			.populate("userReference", "username avatar")
			.sort({ updatedAt: -1 });

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
