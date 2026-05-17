const VesselDischargeStatus = require("../models/vesselDischargeStatusModel.js");
const handlerFactory = require("./handlerFactory.js");

exports.saveVesselDischargeStatusReport = handlerFactory.saveDocument(
	VesselDischargeStatus,
);

exports.getAllVesselDischargeStatusReports = async (
	request,
	response,
	next,
) => {
	try {
		const userId = request.user.id;
		const documents = await VesselDischargeStatus.find({
			userReference: userId,
		}).sort({
			updatedAt: -1,
		});
		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};

exports.getVesselDischargeStatusReport = async (request, response, next) => {
	try {
		const documentId = request.params.id;
		const report = await VesselDischargeStatus.findById(documentId);

		if (!report) {
			return response
				.status(404)
				.json({ success: false, message: "Report not found" });
		}

		if (report.userReference.toString() !== request.user.id) {
			return response
				.status(403)
				.json({ success: false, message: "Unauthorized access restriction" });
		}

		response.status(200).json(report);
	} catch (error) {
		next(error);
	}
};

exports.getEveryonesVesselDischargeStatusReports = async (
	request,
	response,
	next,
) => {
	try {
		const documents = await VesselDischargeStatus.find()
			.populate("userReference", "username avatar")
			.sort({ updatedAt: -1 });

		response.status(200).json(documents);
	} catch (error) {
		next(error);
	}
};
