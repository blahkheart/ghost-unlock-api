require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { users } = require("../config/users");

function decodeB64(str) {
  return decodeURIComponent(atob(str));
}

router.get("/signup/verify/:email", function (req, res, next) {
  // get encoded email from url
  const encodedEmail = req.params.email;
  // decode email
  const email = decodeB64(encodedEmail);
  console.log("EMAIL ", email);
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
        const address = decoded.address;

        // get user with matching address
        const user = users.map((user) => {
          if (
            user.address === address &&
            user.email === email &&
            user.emailVerified === false
          ) {
            return user;
          } else {
            return {};
          }
        })[0];

        let _index;
        !user
          ? res.status(404).json({ message: "User not found!" })
          : _index = users.indexOf(user);
            
        user.emailVerified = true

        // update user info in db
        users[_index] = user;

        // call ghost admin api and create user with email and address

        // respond and redirect to dashboard
        console.log("DECODE:: ", decoded);
        res.send(user);
      }
    }
  );

  // handle errors
  // redirect user
});

module.exports = router;
