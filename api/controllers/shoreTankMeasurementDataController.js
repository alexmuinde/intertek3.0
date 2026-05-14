const ShoreTankMeasurement = require("../models/shoreTankMeasurementDataModel.js");
const factory = require("./handlerFactory.js");

// 1. Unified Save & Update mapping patterns using your structural factory setup
exports.saveShoreTankMeasurement = factory.saveDocument(ShoreTankMeasurement);

// 2. Query all items matching current workspace owner criteria
exports.getAllShoreTankMeasurements = async (req, res, next) => {
	try {
		const documents = await ShoreTankMeasurement.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Single row fetch execution verification cycle
exports.getShoreTankMeasurement = async (req, res, next) => {
	try {
		const document = await ShoreTankMeasurement.findById(req.params.id);

		if (!document) {
			return res
				.status(404)
				.json({ success: false, message: "Measurement record not found" });
		}

		if (document.userRef.toString() !== req.user.id) {
			return res
				.status(403)
				.json({ success: false, message: "Unauthorized access" });
		}

		res.status(200).json(document);
	} catch (error) {
		next(error);
	}
};

// 4. Admin or general pipeline feed overview
exports.getEveryonesShoreTankMeasurements = async (req, res, next) => {
	try {
		const documents = await ShoreTankMeasurement.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
