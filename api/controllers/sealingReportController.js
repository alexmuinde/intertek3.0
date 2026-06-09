// controllers/sealingReportController.js (PART 1: READ ROUTINES & VIEWER CONTEXT)
const SealingReport = require("../models/sealingReportModel.js");
const handlerFactory = require("./handlerFactory.js");

// Retrieve all reports created by the currently logged-in user session
exports.getAllSealingReports = async (request, response, next) => {
	try {
		const userId = request.user.id;
		const documents = await SealingReport.find({ userReference: userId }).sort({
			updatedAt: -1,
		});
		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// Retrieve a single specific report by ID - Accessible to all logged-in users for viewing
exports.getSealingReport = async (request, response, next) => {
	try {
		const documentId = request.params.id;
		// Populate user details so the viewer knows who authored the report
		const report = await SealingReport.findById(documentId).populate("userReference", "username avatar");

		if (!report) {
			return response
				.status(404)
				.json({ success: false, message: "Report not found" });
		}

		// Calculate if the currently logged-in session user is the actual creator of the document
		// Checks against both a direct populated object string or a raw ID string fallback
		const targetCreatorId = report.userReference._id ? report.userReference._id.toString() : report.userReference.toString();
		const isOwner = targetCreatorId === request.user.id;

		// Returns the document payload along with an ownership flag to control frontend edit fields
		response.status(200).json({
			success: true,
			report,
			isOwner
		});
	} catch (error) {
		next(error);
	}
};


// Public/Admin endpoint to fetch every sealing report log entry inside the system database
exports.getEveryonesSealingReports = async (request, response, next) => {
	try {
		const documents = await SealingReport.find()
			.populate("userReference", "username avatar")
			.sort({ updatedAt: -1 });

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// Secure Interceptor Middleware: Prevents unauthorized write attempts before hitting handlerFactory
exports.checkSealingReportOwnership = async (request, response, next) => {
	try {
		// If the request body contains a document ID, it means the user is trying to update an existing report
		const documentId = request.body.id || request.params.id;
		
		if (documentId) {
			const existingReport = await SealingReport.findById(documentId);
			
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

// Save or Update a report securely using the validation interceptor pattern blueprint
exports.saveSealingReport = handlerFactory.saveDocument(SealingReport);
