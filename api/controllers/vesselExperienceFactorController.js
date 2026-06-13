// Import the database model for Vessel Experience Factor reports
const VesselExperienceFactor = require("../models/vesselExperienceFactorModel.js");

// Import the centralized factory handler module
const handlerFactory = require("./handlerFactory.js");

// 1. Save or Update a report using the centralized factory blueprint
exports.saveVesselExperienceFactorReport = handlerFactory.saveDocument(
	VesselExperienceFactor,
);

// 2. Retrieve all reports created by the currently logged-in user
exports.getAllVesselExperienceFactorReports = async (
	request,
	response,
	next,
) => {
	try {
		const userId = request.user.id; // Extracted via verifyToken middleware

		// Find documents matching the user's reference and sort from newest to oldest
		const documents = await VesselExperienceFactor.find({
			userReference: userId,
		}).sort({
			updatedAt: -1,
		});

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Retrieve a single specific report by its database ID with structural security checks
exports.getVesselExperienceFactorReport = async (request, response, next) => {
	try {
		const documentId = request.params.id;
		const report = await VesselExperienceFactor.findById(documentId);

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


// 4. Public/Admin endpoint to fetch every vessel experience factor report in the entire database
exports.getEveryonesVesselExperienceFactorReports = async (
	request,
	response,
	next,
) => {
	try {
		// Pull all documents, inject user creator information, and sort by update timeline
		const documents = await VesselExperienceFactor.find()
			.populate("userReference", "username avatar")
			.sort({ updatedAt: -1 });

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

exports.checkVesselExperienceFactorReportOwnership = async (request, response, next) => {
	try {
		// If the request body contains a document ID, it means the user is trying to update an existing report
		const documentId = request.body.id || request.params.id;
		
		if (documentId) {
			const existingReport = await VesselExperienceFactor.findById(documentId);
			
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
