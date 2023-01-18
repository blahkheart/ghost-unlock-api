require("dotenv").config();
const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const jwt = require("jsonwebtoken");

const generateAccessToken = (data) => {
 return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: 300 });
};

/* GET home page. */
router.post("/", function (req, res, next) {
  // get code from URL
  const codeFromURL = req.body.code;
  // decode code
  const data = JSON.parse(Buffer.from(codeFromURL, "base64"));
  // get address from data
  const address = ethers.utils.verifyMessage(data.d, data.s);
  // get email from body
  const email = req.body.email;
  // create jwt with secret
  const token = generateAccessToken({ email, address });
  console.log("TOKEN:::", token)

  // send email
  // user clicks link
  // sends request to ghost-unlock api
  // get jwt token from request
  // verify jwt
  // create user
  // handle errors
  // redirect user

  // console.log("req",req)
  // console.log("req q", req.query);
  // console.log("data:",data);
  // res.render("signup", { title: "Sign Up", topic: "authentication" });
  res.render("index", { title: "Verify", topic: "authenticating" });
});

module.exports = router;
