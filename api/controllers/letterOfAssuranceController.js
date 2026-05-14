const LetterOfAssurance = require("../models/letterOfAssuranceModel.js");
const factory = require("./handlerFactory.js");

// 1. Save or Update using the global handlerFactory blueprint mapping logic
exports.saveLetterOfAssurance = factory.saveDocument(LetterOfAssurance);

// 2. Query logs array mapped under active logged-in inspector profile
exports.getAllLetterOfAssurances = async (req, res, next) => {
	try {
		const documents = await LetterOfAssurance.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Extract single document validating security compliance requirements
exports.getLetterOfAssurance = async (req, res, next) => {
	try {
		const document = await LetterOfAssurance.findById(req.params.id);

		if (!document) {
			return res.status(404).json({
				success: false,
				message: "Letter of Assurance record not found.",
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
exports.getEveryonesLetterOfAssurances = async (req, res, next) => {
	try {
		const documents = await LetterOfAssurance.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
