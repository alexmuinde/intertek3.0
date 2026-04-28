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

const User = require("../models/userModel.js");
const bycrypt = require('bcryptjs');
const { errorHandler } = require("../utils/error.js");

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
