// Import the User model to interact with the MongoDB database
const User = require("../models/userModel.js");

// Import bcryptjs to securely hash passwords before saving them
const bcryptjs = require("bcryptjs");

// Import a custom error handler function to keep error responses consistent
const { errorHandler } = require("../utils/error.js");

// Export an asynchronous function that handles the update request
exports.updateUser = async (req, res, next) => {
	// Compare the ID from the decrypted token (req.user.id) with the ID in the URL (req.params.id)
	if (req.user.id !== req.params.id)
		// If they don't match, stop here and send a 401 "Unauthorized" error to the next middleware
		return next(errorHandler(401, "You can only update your own account!"));

	// Start a try block to catch any database or server errors during the update
	try {
		// Check if the user sent a new password in the request body
		if (req.body.password) {
			// Hash the new password with 10 salt rounds so it isn't stored as plain text
			req.body.password = bcryptjs.hashSync(req.body.password, 10);
		}

		// Use Mongoose to find the user by their ID and apply the changes
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id, // The ID of the user we want to change
			{
				$set: {
					// Use the $set operator to only update specific fields provided
					username: req.body.username,
					email: req.body.email,
					password: req.body.password,
					avatar: req.body.avatar,
				},
			},
			// Tell MongoDB to return the user data AFTER the update is applied
			{ returnDocument: "after" },
		);

		// Destructure the password out of the document so we don't send it back to the client
		const { password, ...rest } = updatedUser._doc;

		// Send a 200 "OK" status and return the user data (minus the password) as JSON
		res.status(200).json(rest);
	} catch (error) {
		// If anything fails (like a database connection issue), pass the error to the global error handler
		next(error);
	}
};
