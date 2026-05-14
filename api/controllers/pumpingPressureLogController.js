const PumpingPressureLog = require("../models/pumpingPressureLogModel.js");
const factory = require("./handlerFactory.js");

// 1. Unified Save or Update execution routing via global factory method pattern
exports.savePumpingPressureLog = factory.saveDocument(PumpingPressureLog);

// 2. Query logs array mapped under active logged-in inspector profile
exports.getAllPumpingPressureLogs = async (req, res, next) => {
	try {
		const documents = await PumpingPressureLog.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Extract single document validating security compliance requirements
exports.getPumpingPressureLog = async (req, res, next) => {
	try {
		const document = await PumpingPressureLog.findById(req.params.id);

		if (!document) {
			return res.status(404).json({
				success: false,
				message: "Pumping log file instance not found.",
			});
		}

		// Enforces strict equity validation check matching Sealing Report patterns exactly
		if (document.userRef.toString() !== req.user.id) {
			return res.status(403).json({
				success: false,
				message: "Unauthorized resource access vector restriction.",
			});
		}

		res.status(200).json(document);
	} catch (error) {
		next(error);
	}
};

// 4. Admin dashboard stream aggregation query pipeline feeder
exports.getEveryonesPumpingPressureLogs = async (req, res, next) => {
	try {
		const documents = await PumpingPressureLog.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
