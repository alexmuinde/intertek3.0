const { default: User } = require("../models/userModel.js");
const bycrypt = require('bcryptjs')

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
        re.status(500).json(error.message)
    }
    

}