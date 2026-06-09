const express = require("express");
const { signUp, signIn, google } = require("../controllers/authController.js");

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/google", google);

module.exports = router;
