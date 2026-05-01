const User = require("../models/userModel.js");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error.js");
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

// Add 'next' here so you can pass errors to your middleware
exports.signUp = async (req, res, next) => {
	const { username, email, password } = req.body; // destructuring 'password'
	try {
		const hashedPassword = bcryptjs.hashSync(password, 10);
		const newUser = new User({ username, email, password: hashedPassword });
		await newUser.save();
		res.status(201).json({ message: "User created successfully!" });
	} catch (error) {
		next(error);
	}
};

exports.signIn = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const validUser = await User.findOne({ email });
		if (!validUser) return next(errorHandler(404, "User not found!"));

		// Use 'password' from your User model
		const validPassword = bcryptjs.compareSync(password, validUser.password);
		if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

		// Ensure JWT_SECRET is in your .env file
		const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

		// RENAME the destructured password to avoid the 500 error conflict
		const { password: hashedPass, ...rest } = validUser._doc;

		res.cookie("accessToken", token, { httpOnly: true }).status(200).json(rest);
	} catch (error) {
		next(error); // This will pass the specific error to your error middleware
	}
};

exports.google = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (user) {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
			const { password: pass, ...rest } = user._doc;
			res
				.cookie("accessToken", token, { httpOnly: true })
				.status(200)
				.json(rest);
		} else {
			const generatedPassword = Math.random().toString(36).slice(-8);
			const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
			const newUser = new User({
				username:
					req.body.name.split(" ").join("").toLowerCase() +
					Math.random().toString(36).slice(-4),
				email: req.body.email,
				password: hashedPassword,
				avatar: req.body.photo,
			});
			await newUser.save();
			const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
			const { password: pass, ...rest } = newUser._doc;
			res
				.cookie("accessToken", token, { httpOnly: true })
				.status(200)
				.json(rest);
		}
	} catch (error) {
		next(error);
	}
};
