require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const { READONLY } = require("sqlite3");
const { users } = require("../config/users");

const parseQueryParams = (req, res, next) => {
  req.parsedParams = {
    address: req.query.address,
    action: req.query.action,
  };
  next();
};

router.get("/signup/verify/:email",parseQueryParams, function (req, res, next) {
  // get encoded email from url
  // const encodedEmail = req.params.email;
  const action = req.parsedParams.action;
  const address = req.parsedParams.address;
  // decode email
  // const email = decodeB64(encodedEmail);
  const email = req.params.email
  // const _email = req.headers;
  // const _address = req.body;
  console.log("REQ QUERY", req.query)
  console.log("EMAIL PARAMS", email);
  console.log("AcTIOn ", action);
  console.log("ADDRESSXX ", address);
  // console.log("RESS ", res);
  res.status(200).end()
  // decode jwt
  // // And check if email matches email in jwt
  // const token = req.query.token;
  // jwt.verify(
  //   token,
  //   process.env.TOKEN_SECRET,
  //   { subject: email },
  //   function (err, decoded) {
  //     if (err) {
  //       console.log("ERR JWT: ", err);
  //       res.send(err);
  //     } else {
  //       // get address from jwt
  //       const address = decoded.address;

  //       // get user with matching address
  //       const user = users.map((user) => {
  //         if (
  //           user.address === address &&
  //           user.email === email &&
  //           user.emailVerified === false
  //         ) {
  //           return user;
  //         } else {
  //           return {};
  //         }
  //       })[0];

  //       let _index;
  //       !user
  //         ? res.status(404).json({ message: "User not found!" })
  //         : _index = users.indexOf(user);
            
  //       user.emailVerified = true

  //       // update user info in db
  //       users[_index] = user;

  //       // call ghost admin api and create user with email and address

  //       // respond and redirect to dashboard
  //       console.log("DECODE:: ", decoded);
  //       res.send(user);
  //     }
  //   }
  // );

  // handle errors
  // redirect user
});

module.exports = router;
