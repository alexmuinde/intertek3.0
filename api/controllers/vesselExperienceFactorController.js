const VesselExperienceFactor = require("../models/vesselExperienceFactorModel.js");
const factory = require("./handlerFactory.js");

// 1. Save or Update - Leverages your handlerFactory logic
exports.saveVesselExperienceFactorReport = factory.saveDocument(
	VesselExperienceFactor,
);

// 2. Get All - Filtered by the logged-in user for their dashboard
exports.getAllVesselExperienceFactorReports = async (req, res, next) => {
	try {
		// Sort by updatedAt so the most recent reports appear first
		const documents = await VesselExperienceFactor.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Get Single - Specific report for Edit/View with security check
exports.getVesselExperienceFactorReport = async (req, res, next) => {
	try {
		const document = await VesselExperienceFactor.findById(req.params.id);

		if (!document) {
			return res.status(404).json({
				success: false,
				message: "Vessel Experience Factor report not found",
			});
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
exports.getEveryonesVesselExperienceFactorReports = async (req, res, next) => {
	try {
		const documents = await VesselExperienceFactor.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
