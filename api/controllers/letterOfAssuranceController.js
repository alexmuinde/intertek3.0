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

exports.checkLetterOfAssuranceOwnership = async (request, response, next) => {
	try {
		// If the request body contains a document ID, it means the user is trying to update an existing report
		const documentId = request.body.id || request.params.id;
		
		if (documentId) {
			const existingReport = await LetterOfAssurance.findById(documentId);
			
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
