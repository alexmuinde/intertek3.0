// A generic factory handler that abstracts data persistence logic for all inspection forms
exports.saveDocument = (Model) => async (request, response, next) => {
	try {
		// Destructure out the internal MongoDB identification if it exists in the payload
		const { _id, ...data } = request.body;
		const userId = request.user.id; // Injected by your verifyToken middleware layer

		if (_id) {
			// SECURITY: Locate and update the document ONLY if it belongs to the logged-in surveyor
			const document = await Model.findOneAndUpdate(
				{ _id, userReference: userId },
				{ $set: data },
				{ returnDocument: "after", runValidators: true },
			);

			if (!document) {
				return response.status(403).json({
					success: false,
					message: "Unauthorized: You can only edit your own documents.",
				});
			}
			return response.status(200).json(document);
		}

		// CREATE Logic: Initialize new inspection files linked directly to the surveyor
		const newDocument = await Model.create({ ...data, userReference: userId });
		response.status(201).json(newDocument);
	} catch (error) {
		next(error);
	}
};
