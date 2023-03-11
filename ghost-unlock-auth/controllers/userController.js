const User = require("../models/userModel");
const ethers = require("ethers");
const axios = require("axios");

const jwt = require("jsonwebtoken");
const api_key = process.env.ADMIN_API_KEY;
const [id, secret] = api_key.split(":");

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

const signUp = async function (req, res, next) {
  try {
    // get code from URL
    const codeFromURL = req.body.code;
    // check code is provided
    if (!codeFromURL) {
      res.status(400).json({ message: "No code provided" });
    }
    // decode
    const data = JSON.parse(Buffer.from(codeFromURL, "base64"));
    // get address from data
    const address = ethers.utils.verifyMessage(data.d, data.s);
    const email = req.body.email;
    // check email is provided
    if (!email) res.status(400).json({ message: "No email provided" });
    // check input is a valid email

    const payload = {
      email,
      address,
    };

    const isUser = await User.findOne({
      // $or: [{ address }, { email }],
      $and: [{ address }, { email }, { emailVerified: true }],
    });

    const isPending = await User.findOne({
      // $or: [{ address }, { email }],
      $and: [{ address },{ email }, { emailVerified: false }],
    });

    // create new member
    if (!isUser) {
      const newMember = {
        email,
        address,
        emailVerified: false,
      };

      // add to db
      if (!isPending) await User.create(newMember);
      // await User.create(newMember);
      // res.status(201).send(newMember);

      // make call to ghost api with email and address
      try {
        axios
          .post(ghostAPIURL, payload, { headers })
          .then((response) => {
            if (response && response.status === 201) {
              res.status(201).send(newMember);
            } else {
              res.status(400).send({ msg: "error sending magic link" });
            }
          })
          .catch((err) => console.log(err));
      } catch (e) {
        res.send(e);
      }
    } else {
      res.status(409).json({ message: "User already exist" });
    }
  } catch (e) {
    console.log(e.message);
    const msg = e.message
    const duplicateKeyAddressError = msg.match(/address: "(.*)"/i);
    const duplicateKeyEmailError = msg.match(/email: "(.*)"/i);

    if (duplicateKeyAddressError) res.status(400).render("error", {
      message: `Address: ${duplicateKeyAddressError[1]} already exists`,
      error: { status: 400 },
    });
  
    if (duplicateKeyEmailError) res.status(400).render("error", {
      message: `Email: ${duplicateKeyEmailError[1]} already exists`,
      error: { status: 400 },
    });
  }
};

const login = async function (req, res, next) {
  try {
    // get code from URL
    const codeFromURL = req.query.code;

    // check code is provided
    if (!codeFromURL) {
      res.status(400).render("error", { message: "No code found in URL" });
    }
    // decode
    const data = JSON.parse(Buffer.from(codeFromURL, "base64"));
    // get address from data
    const address = ethers.utils.verifyMessage(data.d, data.s);

    const user = await User.findOne({
      $and: [{ address }, { emailVerified: true }],
    });
    console.log("USR", user);

    if (user) {
      const email = user.email;

      const payload = {
        email,
        address,
      };
      // make call to ghost api with email and address
      // try {
      //   axios
      //     .post(ghostAPIURL, payload, { headers })
      //     .then((response) => {
      //       if (response && response.status === 201) {
      //         res.status(201).render("login", {
      //           title: "Ghost-Unlock Login",
      //         });
      //       } else {
      //         res
      //           .status(400)
      //           .render("error", { message: "error sending magic link" });
      //       }
      //     })
      //     .catch((err) => res.render("error", { message: err }));
      // } catch (e) {
      //   res.send(e);
      // }
    } else {
      res.status(404).render("error", {
        message: "User not found!",
        error: { status: 404 },
      });
    }
  } catch (e) {
    console.log(e.message);
  }
};

const verifyUser = async function (req, res) {
  try {
    /** TODOs
     * validate email address
     **/

    // get user data from req
    const email = req.params.email;
    const address = req.parsedParams.address;
    const action = req.parsedParams.action;

    const user = await User.findOne({
      $and: [{ address }, { email }],
    });

    console.log("USER:verify-user", user);
    const filter = { email: email, address: address };

    if (!user) res.status(404).end();

    if (action === "signup" || action === "subscribe") {
      // update user info in db
      const update = { emailVerified: true };
      const updatedUser = await User.findOneAndUpdate(filter, update);
      res.status(200).json(updatedUser);
    } else if (action === "signin" && user.emailVerified === false) {
      // console.log("USERXX", user)
      res.status(403).end();
    } else {
      res.status(200).end();
    }
  } catch (e) {
    console.log("AUTH VERIFY ERR: ", e.message);
  }
};

module.exports = {
  signUp,
  login,
  verifyUser,
};
