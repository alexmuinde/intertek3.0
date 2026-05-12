const VesselDischargeStatus = require("../models/vesselDischargeStatusModel.js");
const factory = require("./handlerFactory.js");

// Save or Update
exports.saveVesselDischargeStatus = factory.saveDocument(VesselDischargeStatus);

// Get User Specific Reports
exports.getAllVesselDischargeStatus = async (req, res, next) => {
	try {
		const documents = await VesselDischargeStatus.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });
		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// Get Single Report
exports.getVesselDischargeStatus = async (req, res, next) => {
	try {
		const document = await VesselDischargeStatus.findById(req.params.id);
		if (!document) {
			return res
				.status(404)
				.json({ success: false, message: "Status report not found" });
		}
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

// Global/Admin View
exports.getEveryonesVesselDischargeStatus = async (req, res, next) => {
	try {
		const documents = await VesselDischargeStatus.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });
		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
