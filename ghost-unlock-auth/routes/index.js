const express = require("express");
const router = express.Router();
const { parseQueryParams } = require("../middleware/parseQueryParams");
const { getHasValidKey } = require("../middleware/getHasValidKey");
const { requestSignUp } = require("../controllers/userController")

/* GET signup page. */
router.get("/", parseQueryParams, getHasValidKey, requestSignUp);

module.exports = router;
