const NoticeOfApparentDiscrepancy = require("../models/noticeOfApparentDiscrepancyModel.js");
const factory = require("./handlerFactory.js");

// 1. Save or Update via master global factory logic
exports.saveNoticeOfApparentDiscrepancy = factory.saveDocument(
	NoticeOfApparentDiscrepancy,
);

// 2. Query logs array mapped under active logged-in inspector profile
exports.getAllNoticeOfApparentDiscrepancies = async (req, res, next) => {
	try {
		const documents = await NoticeOfApparentDiscrepancy.find({
			userRef: req.user.id,
		}).sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

// 3. Extract single document validating security compliance requirements
exports.getNoticeOfApparentDiscrepancy = async (req, res, next) => {
	try {
		const document = await NoticeOfApparentDiscrepancy.findById(req.params.id);

		if (!document) {
			return res.status(404).json({
				success: false,
				message: "Notice of discrepancy file instance not found.",
			});
		}

		// Security constraint validation matching sealing report patterns exactly
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
exports.getEveryonesNoticeOfApparentDiscrepancies = async (req, res, next) => {
	try {
		const documents = await NoticeOfApparentDiscrepancy.find()
			.populate("userRef", "username avatar")
			.sort({ updatedAt: -1 });

		res.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
