const DischargeProcedureSequence = require("../models/dischargeProcedureSequenceModel.js");
const factory = require("./handlerFactory.js");

// 1. Core integration creation update routine mapped via master handlerFactory loop logic
exports.saveDischargeProcedureSequence = factory.saveDocument(
	DischargeProcedureSequence,
);

// 2. Fetch logs array mapped under active logged-in inspector profile
exports.getAllDischargeProcedureSequences = async (req, res, next) => {
	try {
		const documents = await DischargeProcedureSequence.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Extract single document validating security compliance requirements matching SealingReport layout
exports.getDischargeProcedureSequence = async (req, res, next) => {
	try {
		const document = await DischargeProcedureSequence.findById(req.params.id);

		if (!document) {
			return res.status(404).json({
				success: false,
				message: "Discharge procedure record sequence instance not found.",
			});
		}

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

// 4. Admin dashboard stream aggregation query pipeline feeder overview
exports.getEveryonesDischargeProcedureSequences = async (req, res, next) => {
	try {
		const documents = await DischargeProcedureSequence.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
