const User = require("../models/userModel.js");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error.js");
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

// Add 'next' here so you can pass errors to your middleware
exports.signUp = async (req, res, next) => {
	const { username, email, pin } = req.body;

	try {
		// 1. Hash the pin
		const hashedPin = bycrypt.hashSync(pin, 10);

		// 2. Create the new user instance
		const newUser = new User({ username, email, pin: hashedPin });

		// 3. Save to MongoDB (Must be inside try block)
		await newUser.save();

		// 4. Send success response
		res.status(201).json({ message: "User created successfully!" });
	} catch (error) {
		// This will now catch duplicate emails or database connection issues
		next(error);
	}
};

exports.signIn = async (req, res, next) => {
	const { email, pin } = req.body;

	try {
		//check if the user exist
		const validUser = await User.findOne({ email });
		//if the user does not exist
		if (!validUser) return next(errorHandler(404, "User not found!"));
		//check if the PIN matches
		const validPIN = bcryptjs.compareSync(pin, validUser.pin);
		//if the user does not exist
		if (!validPIN) return next(errorHandler(401, "Wrong credentials!"));
		//authenticate the user by creating a token
		const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
		//before sending the valid user, remove the PIN from the rest
		const { pin: password, ...rest } = validUser._doc;
		//save the token as the cookie
		res.cookie("accessToken", token, { httpOnly: true }).status(200).json(rest);
	} catch (error) {
		next(error);
	}
};

/**const User = require("../models/userModel.js"); // CORRECT

const bycrypt = require('bcryptjs');
const { errorHandler } = require("../utils/error.js");

exports.signUp = async (req, res) => {
    //get the information you need from the browser
    const {username, email, pin} = req.body;
    //after getting the pin, hash it 
    const hashedPin = bycrypt.hashSync(pin, 10)
    //create a new user using the user model and pass the hashed password
    const newUser = new User({username, email, pin: hashedPin})
    //save the user
    await newUser.save()
    //catch an error
    try {
        //create a response 
        res.status(201).json("User created successfully!")  
    } catch (error) {
        //send back the error
        next(error) 
    }
    

} */
