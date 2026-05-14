const ShipsTanksUllageReport = require("../models/shipsTanksUllageReportModel.js");
const factory = require("./handlerFactory.js");

// 1. Save or Update logic utilizing global factory pattern
exports.saveShipsTanksUllageReport = factory.saveDocument(
	ShipsTanksUllageReport,
);

// 2. Fetch dataset scoped exclusively to the logged-in inspector
exports.getAllShipsTanksUllageReports = async (req, res, next) => {
	try {
		const documents = await ShipsTanksUllageReport.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Extract singular record validating account level authority bounds
exports.getShipsTanksUllageReport = async (req, res, next) => {
	try {
		const document = await ShipsTanksUllageReport.findById(req.params.id);

		if (!document) {
			return res.status(404).json({
				success: false,
				message: "Ullage report record matrix not found",
			});
		}

		if (document.userRef.toString() !== req.user.id) {
			return res
				.status(403)
				.json({ success: false, message: "Resource permission scope denied" });
		}

		res.status(200).json(document);
	} catch (error) {
		next(error);
	}
};

// 4. Feeder module processing complete stream pipelines for admin spaces
exports.getEveryonesShipsTanksUllageReports = async (req, res, next) => {
	try {
		const documents = await ShipsTanksUllageReport.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
