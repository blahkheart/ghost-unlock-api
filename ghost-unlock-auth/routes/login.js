// require("dotenv").config();
const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const api_key = process.env.ADMIN_API_KEY;
const [id, secret] = api_key.split(":");

// Replace with db
const { users } = require("../config/users");

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
router.get("/", async function (req, res, next) {
  try {
    // get code from URL
    const codeFromURL = req.query.code;

    // check code is provided
    if (!codeFromURL) {
      res.status(400).render("error", { message: "No code found in URL" });
    }
    // decode code
    const data = JSON.parse(Buffer.from(codeFromURL, "base64"));
    // get address from data
    const address = ethers.utils.verifyMessage(data.d, data.s);

    // get user from db using address
    const user = users.map((user) => {
      if (user.address === address && user.emailVerified) {
        return user;
      } else {
        return {};
      }
    })[0];
    console.log("USR", user)

    if (user) {
      const email = user.email;

      const payload = {
        email,
        address,
      };
      try {
        // make call to ghost api with email and address
        axios
          .post(ghostAPIURL, payload, { headers })
          .then((response) => {
            // handle response from ghost and respond appropriately
            if (response && response.status === 201) {
              res.status(201).render("login", {
                title: "Ghost-Unlock Login",
              });
              // res.status(201).end();
            } else {
              res
                .status(400)
                .render("error", { message: "error sending magic link" });
            }
          })
          .catch((err) => res.render("error", { message: err }));
      } catch (e) {
        res.send(e);
      }
    } else {
      res.status(404).render("error",{ message: "User not found!", error: {status: 404} });
    }
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
