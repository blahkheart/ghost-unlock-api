const express = require("express");
const router = express.Router();
const { login } = require("../controllers/userController");

/* @desc login user
*  @route GET /login
*  @access public
*/

router.get("/", login)

module.exports = router;
