const LetterOfAssurance = require("../models/letterOfAssuranceModel.js");
const handlerFactory = require("./handlerFactory.js");

// Save or Update an assurance entry using the factory handler blueprint
exports.saveLetterOfAssuranceReport =
	handlerFactory.saveDocument(LetterOfAssurance);

// Retrieve all reports created by the currently logged-in user session
exports.getAllLetterOfAssuranceReports = async (request, response, next) => {
	try {
		const userId = request.user.id;
		const documents = await LetterOfAssurance.find({
			userReference: userId,
		}).sort({
			updatedAt: -1,
		});
		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// Retrieve a single specific report by ID with secure user verification checks
exports.getLetterOfAssuranceReport = async (request, response, next) => {
	try {
		const documentId = request.params.id;
		const report = await LetterOfAssurance.findById(documentId);

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

// Public/Admin endpoint to fetch every assurance document across all active surveyors
exports.getEveryonesLetterOfAssuranceReports = async (
	request,
	response,
	next,
) => {
	try {
		const documents = await LetterOfAssurance.find()
			.populate("userReference", "username avatar")
			.sort({ updatedAt: -1 });

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
