const express = require('express');
const { test } = require('../controllers/userContoller.js');

const router = express.Router();

router.get('/test', test);
 
//export default router;
module.exports = router;