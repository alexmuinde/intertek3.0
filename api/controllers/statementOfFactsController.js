const StatementOfFacts = require("../models/statementOfFactsModel.js");
const factory = require("./handlerFactory.js");

// 1. Save or Update - Uses the secure factory logic we built
exports.saveSOF = factory.saveDocument(StatementOfFacts);

// 2. Get All - Used for the Profile Dashboard (Filtered by User)

// statementOfFactsController.js

exports.getAllSOF = async (req, res, next) => {
	try {
		// Sort by updatedAt so the most recently edited files appear first
		const documents = await StatementOfFacts.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Get Single - Used when clicking "Edit" from the dashboard
exports.getSOF = async (req, res, next) => {
	try {
		const document = await StatementOfFacts.findById(req.params.id);

		if (!document)
			return res
				.status(404)
				.json({ success: false, message: "Document not found" });

		// Security: Prevent users from viewing someone else's document by ID
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

// Create a new public fetcher
exports.getEveryonesDocs = async (req, res, next) => {
	try {
		// Change 'Model' to 'StatementOfFacts'
		const documents = await StatementOfFacts.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });
		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
