const EndOfPipelineSampleReport = require("../models/endOfPipelineSampleReportModel.js");
const factory = require("./handlerFactory.js");

// 1. Core creation and updates logic mapping via handlerFactory pattern
exports.saveEndOfPipelineSampleReport = factory.saveDocument(
	EndOfPipelineSampleReport,
);

// 2. Fetch dataset filtered under active inspector id criteria
exports.getAllEndOfPipelineSampleReports = async (req, res, next) => {
	try {
		const documents = await EndOfPipelineSampleReport.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Isolated record verification processing security loops
exports.getEndOfPipelineSampleReport = async (req, res, next) => {
	try {
		const document = await EndOfPipelineSampleReport.findById(req.params.id);

		if (!document) {
			return res
				.status(404)
				.json({ success: false, message: "End of pipeline report not found." });
		}

		// Validation check matching SealingReport exactly
		if (document.userRef.toString() !== req.user.id) {
			return res.status(403).json({
				success: false,
				message: "Resource permission scope mapping restriction.",
			});
		}

		res.status(200).json(document);
	} catch (error) {
		next(error);
	}
};

// 4. Shared administration layout pipeline feed aggregator
exports.getEveryonesEndOfPipelineSampleReports = async (req, res, next) => {
	try {
		const documents = await EndOfPipelineSampleReport.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
