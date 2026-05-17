const LetterOfProtestShoreFinalOutturnFigures = require("../models/letterOfProtestShoreFinalOutturnFiguresModel.js");
const handlerFactory = require("./handlerFactory.js");

// Save or Update a report using the centralized factory framework blueprint
exports.saveLetterOfProtestShoreFinalOutturnFiguresReport =
	handlerFactory.saveDocument(LetterOfProtestShoreFinalOutturnFigures);

// Retrieve all reports created by the currently logged-in user session
exports.getAllLetterOfProtestShoreFinalOutturnFiguresReports = async (
	request,
	response,
	next,
) => {
	try {
		const userId = request.user.id;
		const documents = await LetterOfProtestShoreFinalOutturnFigures.find({
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
exports.getLetterOfProtestShoreFinalOutturnFiguresReport = async (
	request,
	response,
	next,
) => {
	try {
		const documentId = request.params.id;
		const report =
			await LetterOfProtestShoreFinalOutturnFigures.findById(documentId);

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

// Public/Admin endpoint to fetch every outturn report log entry inside the system database
exports.getEveryonesLetterOfProtestShoreFinalOutturnFiguresReports = async (
	request,
	response,
	next,
) => {
	try {
		const documents = await LetterOfProtestShoreFinalOutturnFigures.find()
			.populate("userReference", "username avatar")
			.sort({ updatedAt: -1 });

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
