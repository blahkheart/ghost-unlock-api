const express = require("express");
const router = express.Router();
const { verifyUser } = require("../controllers/userController");
const {parseQueryParams} = require("../middleware/parseQueryParams")

/* @desc verify user
*  @route GET /auth/verify
*  @access public
*/

router.get("/:email", parseQueryParams, verifyUser);

module.exports = router;
