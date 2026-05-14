const LetterOfProtestSlowRate = require("../models/letterOfProtestSlowRateModel.js");
const factory = require("./handlerFactory.js");

// 1. Save or Update using standard backend factory integration patterns
exports.saveLetterOfProtestSlowRate = factory.saveDocument(
	LetterOfProtestSlowRate,
);

// 2. Query logs array mapped under active logged-in inspector profile
exports.getAllLetterOfProtestSlowRates = async (req, res, next) => {
	try {
		const documents = await LetterOfProtestSlowRate.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Extract single document validating security compliance requirements
exports.getLetterOfProtestSlowRate = async (req, res, next) => {
	try {
		const document = await LetterOfProtestSlowRate.findById(req.params.id);

		if (!document) {
			return res.status(404).json({
				success: false,
				message: "Slow rate letter of protest not found.",
			});
		}

		// Security boundary check mirroring original SealingReport logic loops
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
exports.getEveryonesLetterOfProtestSlowRates = async (req, res, next) => {
	try {
		const documents = await LetterOfProtestSlowRate.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
