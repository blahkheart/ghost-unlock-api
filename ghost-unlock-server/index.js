require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const ethers = require("ethers");
const nodemailer = require("nodemailer");
const app = express();

app.use(express.json()); // used in request processing pipeline
const port = process.env.PORT || 5000;
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "de9546c556f63a",
    pass: "a68eee6ddc87d0",
  },
});

// replace with db connection
let users = [];

// const verifySignature = (sig) => {
//   if (!sig) res.status(400).send("No signature provided");
//   const data = JSON.parse(Buffer.from(sig, "base64"));
//   const address = ethers.utils.verifyMessage(data.d, data.s);
//   return address
// };

// const generateSignUpWithUnlockURL = (req) => {
//   const signinWithUnlock = new URL(process.env.UNLOCK_APP_CHECKOUT);
//   const signupVerifyURI = new URL(process.env.GHOST_SIGNUP_VERIFY_URI);
//   const clientId = signupVerifyURI.hostname;
//   signinWithUnlock.searchParams.append("client_id", clientId);
//   signinWithUnlock.searchParams.append("redirect_uri", signupVerifyURI);
//   return signinWithUnlock.toString();
// };
// const generateSignInWithUnlockURL = (req) => {
//   const signinWithUnlock = new URL(process.env.UNLOCK_APP_CHECKOUT);
//   const loginVerifyURI = new URL(process.env.GHOST_LOGIN_VERIFY_URI);
//   const clientId = loginVerifyURI.hostname;
//   signinWithUnlock.searchParams.append("client_id", clientId);
//   signinWithUnlock.searchParams.append("redirect_uri", loginVerifyURI);
//   signinWithUnlock.searchParams.append("email", req.body.email);
//   return signinWithUnlock.toString();
// };

app.post("/login", async (req, res) => {
  //login flow
  // user enters email
  // login request hits /login endpoint
  // server responds with a 'signin with unlock url' sent to email address
  // client clicks the link in their email which takes them through the signinWithUnlock checkout and redirects to /login/verify endpoint
  // this decodes their address from the signature and checks db for a user with the address and the email combination
  const signInURL = "https://app.unlock-protocol.com/checkout";
  const recepient = req.body.email;
  if (!recepient) res.status(400).send("No email provided");
  console.log("res:: ", res.body);
  // send mail with defined transport object
  try {
    let info = await transporter.sendMail({
      from: '"Ghost Unlock 👻" <ghost@unlock.com>', // sender address
      to: `${recepient}`, // list of receivers
      subject: "Login ✔", // Subject line
      text: "Login to your account!", // plain text body
      html: `<a href="${signInURL}">Login now</a>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
    if (info) {
      res.status(200).send(info.messageId);
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/login/verify", (req, res) => {
  const codeFromURL = req.query.code;
  const email = req.query.email;
  console.log("email::: ", email);
  if (!codeFromURL || !email)
    res.status(400).send("No signature or email provided");
  const data = JSON.parse(Buffer.from(codeFromURL, "base64"));
  const address = ethers.utils.verifyMessage(data.d, data.s);
  const user = users.find(
    (user) => user.address === address && user.email === email
  );

  if (!user) {
    res
      .status(404)
      .send(`user with address ${address} and email: ${email} was not found`);
  } else {
    console.log(`user:: ${user.email} logged in`);
    res.status(200).send(`logged in ${email}`);
  }
});

app.post("/signup", async (req, res) => {
  //sign up flow
  // new user enters email
  // sign up request hits /signup endpoint
  // server generate signinURL
  // server responds with a 'signin with unlock url' sent to email address
  // client clicks the link in their email which takes them through the signinWithUnlock checkout and redirects to /verify endpoint
  // this decodes their address from the signature and creates a new member using the email and address
  const signInURL = generateSignUpWithUnlockURL(req);
  const recepient = req.body.email;

  // send mail with defined transport object
  try {
    let info = await transporter.sendMail({
      from: '"Ghost Unlock 👻" <ghost@unlock.com>', // sender address
      to: `${recepient}`, // list of receivers
      subject: "Sign up ✔", // Subject line
      text: "Become a member!", // plain text body
      html: `<a href="${signInURL}">Join now</a>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
    if (info) {
      res.status(200).send(info.messageId);
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/signup/verify", (req, res) => {
  const codeFromURL = req.query.code;
  const email = req.query.email;
  if (!codeFromURL || !email)
    res.status(400).send("No signature or email provided");
  const data = JSON.parse(Buffer.from(codeFromURL, "base64"));
  const address = ethers.utils.verifyMessage(data.d, data.s);
  const user = users.find((user) => user.email === email);
  if (!user) {
    const newUser = {
      email,
      address,
    };
    users.push(newUser);
    res.status(200).send(newUser);
  } else {
    res.status(400).send("Already signed up");
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
