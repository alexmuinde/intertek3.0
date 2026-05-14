const LetterOfProtestShoreFinalOutturnFigures = require("../models/letterOfProtestShoreFinalOutturnFiguresModel.js");
const factory = require("./handlerFactory.js");

// 1. Save or Update via master global factory schema logic mapping pattern
exports.saveLetterOfProtestShoreFinalOutturnFigures = factory.saveDocument(
	LetterOfProtestShoreFinalOutturnFigures,
);

// 2. Query logs array mapped under active logged-in inspector profile
exports.getAllLetterOfProtestShoreFinalOutturnFigures = async (
	req,
	res,
	next,
) => {
	try {
		const documents = await LetterOfProtestShoreFinalOutturnFigures.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Extract single document validating security compliance requirements
exports.getLetterOfProtestShoreFinalOutturnFigures = async (req, res, next) => {
	try {
		const document = await LetterOfProtestShoreFinalOutturnFigures.findById(
			req.params.id,
		);

		if (!document) {
			return res.status(404).json({
				success: false,
				message: "Final outturn letter of protest not found.",
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
exports.getEveryonesLetterOfProtestShoreFinalOutturnFigures = async (
	req,
	res,
	next,
) => {
	try {
		const documents = await LetterOfProtestShoreFinalOutturnFigures.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
