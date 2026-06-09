// Import the Express framework to create our router
const express = require("express");

// Import the controller functions that contain the actual logic for each route
const { updateUser } = require("../controllers/userController.js");

// Import the middleware that checks if the user has a valid login token (JWT)
const { verifyToken } = require("../utils/verifyUser.js");

// Initialize the Express router object to define our paths
const router = express.Router();

// A simple GET route used to test if the user API is working correctly

router.post("/update/:id", verifyToken, updateUser);

// Export the router so it can be used in the main index.js/server.js file
module.exports = router;
