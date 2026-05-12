const ShoreTankQuantityReport = require("../models/shoreTankQuantityReportModel.js");
const factory = require("./handlerFactory.js");

exports.saveShoreTankQuantityReport = factory.saveDocument(
	ShoreTankQuantityReport,
);

exports.getAllShoreTankQuantityReports = async (req, res, next) => {
	try {
		const docs = await ShoreTankQuantityReport.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });
		res.status(200).json(docs);
	} catch (error) {
		next(error);
	}
};

exports.getShoreTankQuantityReport = async (req, res, next) => {
	try {
		const doc = await ShoreTankQuantityReport.findById(req.params.id);
		if (!doc || doc.userRef !== req.user.id)
			return res.status(403).json({ success: false, message: "Unauthorized" });
		res.status(200).json(doc);
	} catch (error) {
		next(error);
	}
};

// 4. Public/Admin Fetcher - Shows reports from all users for the Global Dashboard
exports.getEveryonesShoreTankQuantityReports = async (req, res, next) => {
	try {
		const documents = await ShoreTankQuantityReport.find()
			.populate("userRef", "username avatar") // Includes creator details
			.sort({ updatedAt: -1 }); // Newest first

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
