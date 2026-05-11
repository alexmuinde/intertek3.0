const SealingReport = require("../models/sealingReportModel.js");
const factory = require("./handlerFactory.js");

// 1. Save or Update - Uses your existing factory logic
exports.saveSealingReport = factory.saveDocument(SealingReport);

// 2. Get All - Filtered by the logged-in user for their dashboard
exports.getAllSealingReports = async (req, res, next) => {
	try {
		// Sort by updatedAt so the most recent reports appear first
		const documents = await SealingReport.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Get Single - Specific report for Edit mode with security check
exports.getSealingReport = async (req, res, next) => {
	try {
		const document = await SealingReport.findById(req.params.id);

		if (!document) {
			return res
				.status(404)
				.json({ success: false, message: "Report not found" });
		}

		// Security: Ensure only the owner can access this specific ID
		if (document.userRef !== req.user.id) {
			return res
				.status(403)
				.json({ success: false, message: "Unauthorized access" });
		}

		res.status(200).json(document);
	} catch (error) {
		next(error);
	}
};

// 4. Public/Admin Fetcher - Shows reports from all users
exports.getEveryonesSealingReports = async (req, res, next) => {
	try {
		const documents = await SealingReport.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
