const ShoreTankCleanlinessReport = require("../models/shoreTankCleanlinessReportModel.js");
const handlerFactory = require("./handlerFactory.js");

// Save or Update a cleanliness document entry using the factory handler blueprint
exports.saveShoreTankCleanlinessReport = handlerFactory.saveDocument(
	ShoreTankCleanlinessReport,
);

// Retrieve all cleanliness reports created by the currently logged-in user session
exports.getAllShoreTankCleanlinessReports = async (request, response, next) => {
	try {
		const userId = request.user.id;
		const documents = await ShoreTankCleanlinessReport.find({
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
exports.getShoreTankCleanlinessReport = async (request, response, next) => {
	try {
		const documentId = request.params.id;
		const report = await ShoreTankCleanlinessReport.findById(documentId);

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


// Public/Admin endpoint to fetch every cleanliness document across all active surveyors
exports.getEveryonesShoreTankCleanlinessReports = async (
	request,
	response,
	next,
) => {
	try {
		const documents = await ShoreTankCleanlinessReport.find()
			.populate("userReference", "username avatar")
			.sort({ updatedAt: -1 });

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

exports.checkShoreTankCleanlinessReportOwnership = async (request, response, next) => {
	try {
		// If the request body contains a document ID, it means the user is trying to update an existing report
		const documentId = request.body.id || request.params.id;
		
		if (documentId) {
			const existingReport = await ShoreTankCleanlinessReport.findById(documentId);
			
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
