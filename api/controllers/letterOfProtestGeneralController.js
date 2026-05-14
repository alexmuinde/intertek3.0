const LetterOfProtestGeneral = require("../models/letterOfProtestGeneralModel.js");
const factory = require("./handlerFactory.js");

// 1. Save or Update via master global factory logic
exports.saveLetterOfProtestGeneral = factory.saveDocument(
	LetterOfProtestGeneral,
);

// 2. Query logs array mapped under active logged-in inspector profile
exports.getAllLetterOfProtestGenerals = async (req, res, next) => {
	try {
		const documents = await LetterOfProtestGeneral.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Extract single document validating security compliance requirements
exports.getLetterOfProtestGeneral = async (req, res, next) => {
	try {
		const document = await LetterOfProtestGeneral.findById(req.params.id);

		if (!document) {
			return res.status(404).json({
				success: false,
				message: "General letter of protest file not found.",
			});
		}

		// Security constraint tracking validation matching sealing report patterns exactly
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
exports.getEveryonesLetterOfProtestGenerals = async (req, res, next) => {
	try {
		const documents = await LetterOfProtestGeneral.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
