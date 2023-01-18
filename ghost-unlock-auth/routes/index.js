const express = require("express");
const router = express.Router();

/* GET signup page. */
router.get("/", function (req, res, next) {
  res.render("signup", { title: "Ghost-Unlock Sign Up", topic: "authentication" });
});

module.exports = router;
