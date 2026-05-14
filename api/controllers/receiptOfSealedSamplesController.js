const ReceiptOfSealedSamples = require("../models/receiptOfSealedSamplesModel.js");
const factory = require("./handlerFactory.js");

// 1. Save or Update using master global factory pattern tracking structures
exports.saveReceiptOfSealedSamples = factory.saveDocument(
	ReceiptOfSealedSamples,
);

// 2. Fetch dataset filtered cleanly under active logged-in user context
exports.getAllReceiptOfSealedSamples = async (req, res, next) => {
	try {
		const documents = await ReceiptOfSealedSamples.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Singular data component trace route validating ownership parameters
exports.getReceiptOfSealedSamples = async (req, res, next) => {
	try {
		const document = await ReceiptOfSealedSamples.findById(req.params.id);

		if (!document) {
			return res
				.status(404)
				.json({ success: false, message: "Sample receipt record not found." });
		}

		if (document.userRef.toString() !== req.user.id) {
			return res.status(403).json({
				success: false,
				message: "Unauthorized token resource validation failure.",
			});
		}

		res.status(200).json(document);
	} catch (error) {
		next(error);
	}
};

// 4. Global admin dashboard pipeline data aggregator view feed
exports.getEveryonesReceiptOfSealedSamples = async (req, res, next) => {
	try {
		const documents = await ReceiptOfSealedSamples.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
