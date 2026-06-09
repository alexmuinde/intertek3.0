const StatementOfFacts = require("../models/statementOfFactsModel.js");
const handlerFactory = require("./handlerFactory.js");

// Save or Update a report using the centralized factory blueprint
exports.saveStatementOfFactsReport =
	handlerFactory.saveDocument(StatementOfFacts);

// Retrieve all reports created by the currently logged-in user
exports.getAllStatementOfFactsReports = async (request, response, next) => {
	try {
		const userId = request.user.id;
		const documents = await StatementOfFacts.find({
			userReference: userId,
		}).sort({
			updatedAt: -1,
		});
		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// Retrieve a single specific report by its database ID with structural security checks
exports.getStatementOfFactsReport = async (request, response, next) => {
	try {
		const documentId = request.params.id;
		const report = await StatementOfFacts.findById(documentId);

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

// Public/Admin endpoint to fetch every statement of facts report in the entire database
exports.getEveryonesStatementOfFactsReports = async (
	request,
	response,
	next,
) => {
	try {
		const documents = await StatementOfFacts.find()
			.populate("userReference", "username avatar")
			.sort({ updatedAt: -1 });

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
