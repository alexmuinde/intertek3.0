const ShoreTankCleanlinessReport = require("../models/shoreTankCleanlinessReportModel.js");
const factory = require("./handlerFactory.js");

// 1. Unified Save & Update - Uses factory structural pattern safely
exports.saveShoreTankCleanlinessReport = factory.saveDocument(
	ShoreTankCleanlinessReport,
);

// 2. Filter records completely mapped under current session inspector ID
exports.getAllShoreTankCleanlinessReports = async (req, res, next) => {
	try {
		const documents = await ShoreTankCleanlinessReport.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Extract singular model instance verifying ownership claims
exports.getShoreTankCleanlinessReport = async (req, res, next) => {
	try {
		const document = await ShoreTankCleanlinessReport.findById(req.params.id);

		if (!document) {
			return res
				.status(404)
				.json({ success: false, message: "Cleanliness report not found" });
		}

		if (document.userRef.toString() !== req.user.id) {
			return res.status(403).json({
				success: false,
				message: "Unauthorized access path restriction",
			});
		}

		res.status(200).json(document);
	} catch (error) {
		next(error);
	}
};

// 4. Operational dashboard pipeline overview feeder
exports.getEveryonesShoreTankCleanlinessReports = async (req, res, next) => {
	try {
		const documents = await ShoreTankCleanlinessReport.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
