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

		// Security boundary: Validate that the document's creator matches the requesting session
		if (report.userReference.toString() !== request.user.id) {
			return response.status(403).json({
				success: false,
				message: "Unauthorized access: You cannot view this report.",
			});
		}

		response.status(200).json(report);
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
