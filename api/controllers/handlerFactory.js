exports.saveDocument = (Model) => async (req, res, next) => {
	try {
		const { _id, ...data } = req.body;
		const userId = req.user.id; // From verifyToken middleware

		if (_id) {
			// SECURITY: Only update if the document exists AND belongs to this user
			const document = await Model.findOneAndUpdate(
				{ _id, userRef: userId },
				{ $set: data },
				{ returnDocument: "after", runValidators: true },
			);

			if (!document) {
				return res.status(403).json({
					success: false,
					message: "Unauthorized: You can only edit your own documents.",
				});
			}
			return res.status(200).json(document);
		}

		// CREATE Logic: New documents always get the current user's ID
		const newDocument = await Model.create({ ...data, userRef: userId });
		res.status(201).json(newDocument);
	} catch (error) {
		next(error);
	}
};
