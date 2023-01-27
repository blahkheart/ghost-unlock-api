require("dotenv").config();
const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const jwt = require("jsonwebtoken");
const {transporter} = require("../controllers/email")

const generateAccessToken = (data) => {
 return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: 300 });
};

function encodeB64(str) {
  return btoa(encodeURIComponent(str));
}


// Replace with db
const users = [
  {
    email: "dannithomx@gmail.com",
    address: "0xCA7632327567796e51920F6b16373e92c7823854",
    createdAt: 1674747360107,
    emailVerified: true,
  },
];

/* GET home page. */
router.post("/", async function (req, res, next) {
  // get code from URL
  const codeFromURL = req.body.code;
  // check code is provided

  // decode code
  const data = JSON.parse(Buffer.from(codeFromURL, "base64"));
  // get address from data
  const address = ethers.utils.verifyMessage(data.d, data.s);
  // get email from body
  const email = req.body.email;
  // check email is provided
  // check input is a valid email
  if (!email) res.status(400).send("No email provided");
  // create jwt with secret
  const token = generateAccessToken({ sub: email, address });
  // create url with token
  let encodedEmail = encodeB64(email)
  let signUpURL = `${process.env.AUTH_SERVER_URL}/signup/verify/${encodedEmail}?token=${token}`;
  // check if user exists
  const isUser = users.map((user) => {
    user.address === address && user.emailVerified ? true : false;
  });
  console.log("ISUSER::", isUser)
  // create
  if (!isUser) {
    const newMember = {
      email,
      address,
      createdAt: Date.now(),
      emailVerified: false,
    };
    // add to db
    users.push(newMember);
    // send token to email
    try {
      // let info = await transporter.sendMail({
      //   from: '"Ghost Unlock 👻" <ghost@unlock.com>', // sender address
      //   to: `${email}`, // list of receivers
      //   subject: "Complete your Sign Up to Ghost Unlock✔", // Subject line
      //   text: "Complete sign up!", // plain text body
      //   html: `<a href="${signUpURL}">Sign Up</a>`, // html body
      // });

      // if (info) {
      //   console.log("Message sent: %s", info.messageId);
      //   res.status(201).send(info.messageId);
      //   res.send(newMember);
      // }
      res.json(newMember);
    } catch (e) {
      res.send(e);
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
});

module.exports = router;
