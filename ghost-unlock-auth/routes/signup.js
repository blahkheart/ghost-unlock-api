require("dotenv").config();
const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const generateAccessToken = (data) => {
 return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: 300 });
};
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "de9546c556f63a",
    pass: "a68eee6ddc87d0",
  },
});
function encodeB64(str) {
  return btoa(encodeURIComponent(str));
}

// Replace with db
const users = []

/* GET home page. */
router.post("/", async function (req, res, next) {
  // get code from URL
  const codeFromURL = req.body.code;
  // decode code
  const data = JSON.parse(Buffer.from(codeFromURL, "base64"));
  // get address from data
  const address = ethers.utils.verifyMessage(data.d, data.s);
  // get email from body
  const email = req.body.email;
  if (!email) res.status(400).send("No email provided");
  // create jwt with secret
  const token = generateAccessToken({ sub: email, address });
  // create url with token
  let encodedEmail = encodeB64(email)
  let signUpURL = `${process.env.AUTH_SERVER_URL}/signup/verify/${encodedEmail}?token=${token}`;
  // check if user exists
  const isUser = users.forEach((user) => {
    user.address === address && user.emailVerified ? true : false;
  });
  // create
  if (!isUser) {
    const newMember = {
      email,
      address,
      createdAt: Date.now(),
      emailVerified: false,
    };
    users.push(newMember);
    // send token to email
    try {
      let info = await transporter.sendMail({
        from: '"Ghost Unlock 👻" <ghost@unlock.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "Complete your Sign Up to Ghost Unlock✔", // Subject line
        text: "Complete sign up!", // plain text body
        html: `<a href="${signUpURL}">Sign Up</a>`, // html body
      });
      console.log("Message sent: %s", info.messageId);
      if (info) {
        // res.status(200).send(info.messageId);
        res.send(newMember);
      }
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.json({ message: "User already exist" });
  }

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
  //   res.render("index", { title: "Verify", topic: "authenticating" });
});

module.exports = router;
