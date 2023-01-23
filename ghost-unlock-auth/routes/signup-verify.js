require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

function decodeB64(str) {
  return decodeURIComponent(atob(str));
}

router.get("/signup/verify/:email", function (req, res, next) {
  // get encoded email from url
  const encodedEmail = req.params.email;
  // decode email
  const email = decodeB64(encodedEmail);
  // decode jwt
  // // And check if email matches email in jwt
  const token = req.query.token;
  jwt.verify(
    token,
    process.env.TOKEN_SECRET,
    { subject: email },
    function (err, decoded) {
      if (err) {
        console.log("ERR JWT: ", err);
        res.send(err);
      } else {
        // get address from jwt
        // get user with matching address
        // set emailVerified to true
        // call ghost admin api and create user with email and address
        // respond and redirect to dashboard
        console.log("DECODE:: ", decoded);
        res.send(decoded);
      }
    }
  );
});

module.exports = router;
