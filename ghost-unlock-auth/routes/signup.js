require("dotenv").config();
const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const api_key = process.env.ADMIN_API_KEY;
const [id, secret] = api_key.split(":");
const {transporter} = require("../controllers/email")
// Replace with db
const {users} = require("../config/users")

// const generateAccessToken = (data) => {
//  return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1h' });
// };

// function encodeB64(str) {
//   return btoa(encodeURIComponent(str));
// }

const token = jwt.sign({}, Buffer.from(secret, "hex"), {
  keyid: id,
  algorithm: "HS256",
  expiresIn: "5m",
  audience: `/admin/`,
});

const ghostAPIURL = "http://localhost:2368/members/api/send-magic-link/";
const headers = {
  Origin: "http://localhost:3000",
  "Content-Type": "application/json",
  Authorization: `Ghost ${token}`,
  "Accept-Version": "v5.24",
};

/* GET home page. */
router.post("/", async function (req, res, next) {
  try {
    // get code from URL
    const codeFromURL = req.body.code;
    // check code is provided
    if (!codeFromURL) {
      res.status(400).json({ message: "No code provided" });
    }
    // decode code
    const data = JSON.parse(Buffer.from(codeFromURL, "base64"));
    // get address from data
    const address = ethers.utils.verifyMessage(data.d, data.s);
    // get email from body
    const email = req.body.email;
    // check email is provided
    if (!email) res.status(400).json({ message: "No email provided" });
    // check input is a valid email

    const payload = {
      email,
      address,
    };
    // create jwt token using secret
    // const token = generateAccessToken({ sub: email, address });

    // encode email
    // let encodedEmail = encodeB64(email)

    // create url with token
    // let signUpURL = `${process.env.AUTH_SERVER_URL}/signup/verify/${encodedEmail}?token=${token}`;

    // check if user exists
    const isUser = users.map((user) => {
      if (user.address === address && user.emailVerified) {
        return true;
      } else {
        return false;
      }
    })[0];
    // create new member
    if (!isUser) {
      const newMember = {
        email,
        address,
        createdAt: Date.now(),
        emailVerified: false,
      };
      // add to db
      users.push(newMember);

      try {
        // send token to email
        // let info = await transporter.sendMail({
        //   from: '"Ghost Unlock 👻" <ghost@unlock.com>', // sender address
        //   to: `${email}`, // list of receivers
        //   subject: "Complete your Sign Up to Ghost Unlock✔", // Subject line
        //   text: "Complete sign up!", // plain text body
        //   html: `<a href="${signUpURL}">Sign Up</a>`, // html body
        // });
        // if (info) {
        //   console.log("Message sent: %s", info.messageId);
        //   res.status(201).json(newMember);
        // }

        // make call to ghost api with email and address
        axios
          .post(ghostAPIURL, payload, { headers })
          .then((response) => {
            
            // handle response from ghost and respond appropriately
            // response && response.status === 201
            // ? (isMagicLinkSent = true)
            // : (isMagicLinkSent = false);
            if (response && response.status === 201) {
              res.status(201).send(newMember)
              // i
            } else {
              res.status(402).send({msg: "error sending magic link"})
            } 
          })
          .catch((err) => console.log(err));
        // if (isMagicLinkSent) {
        //   console.log("MAGIC LINK00:::", isMagicLinkSent);
        //   res.send(newMember);
        // } else {
        //   res.status(402);
        //   // res.end()
        // }
      } catch (e) {
        res.send(e);
      }
    } else {
      res.status(409).json({ message: "User already exist" });
    }
  } catch (e) {
    console.log(e)
  }
});

module.exports = router;
