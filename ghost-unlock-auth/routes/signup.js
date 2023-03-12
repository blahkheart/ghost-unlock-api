const express = require("express");
const router = express.Router();
const { signUp } = require("../controllers/userController");

/* @desc create user
*  @route POST /signup/verify
*  @access public
*/

router.post("/", signUp)

module.exports = router;
