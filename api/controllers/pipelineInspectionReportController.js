const PipelineInspectionReport = require("../models/pipelineInspectionReportModel.js");
const factory = require("./handlerFactory.js");

// 1. Unified Save & Update utilizing your custom master handlerFactory logic block
exports.savePipelineInspectionReport = factory.saveDocument(
	PipelineInspectionReport,
);

// 2. Fetch all entries filtered precisely by the active session inspector ID
exports.getAllPipelineInspectionReports = async (req, res, next) => {
	try {
		const documents = await PipelineInspectionReport.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Specific item extractor processing identity access checking loops
exports.getPipelineInspectionReport = async (req, res, next) => {
	try {
		const document = await PipelineInspectionReport.findById(req.params.id);

		if (!document) {
			return res.status(404).json({
				success: false,
				message: "Pipeline report instance data not found.",
			});
		}

		// Security constraint validation exactly matching SealingReport logic loops
		if (document.userRef.toString() !== req.user.id) {
			return res.status(403).json({
				success: false,
				message: "Unauthorized access vector restriction.",
			});
		}

		res.status(200).json(document);
	} catch (error) {
		next(error);
	}
};

// 4. Global system query stream aggregator feed for administration panels
exports.getEveryonesPipelineInspectionReports = async (req, res, next) => {
	try {
		const documents = await PipelineInspectionReport.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
