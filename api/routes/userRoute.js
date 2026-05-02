// Import the Express framework to create our router
const express = require("express");

// Import the controller functions that contain the actual logic for each route
const { test, updateUser } = require("../controllers/userController.js");

// Import the middleware that checks if the user has a valid login token (JWT)
const { verifyToken } = require("../utils/verifyUser.js");

// Initialize the Express router object to define our paths
const router = express.Router();

// A simple GET route used to test if the user API is working correctly

/**
 * Update Route Flow:
 * 1. Client sends a POST request to /update/123
 * 2. verifyToken runs first: If the token is missing or fake, it stops the request here.
 * 3. If verified, updateUser runs next: It checks if ID 123 matches the token and saves data.
 */
router.post("/update/:id", verifyToken, updateUser);

// Export the router so it can be used in the main index.js/server.js file
module.exports = router;

/**const express = require('express');
const { test } = require('../controllers/userContoller.js');

const router = express.Router();

router.get('/test', test);
 
//export default router;
module.exports = router; */
