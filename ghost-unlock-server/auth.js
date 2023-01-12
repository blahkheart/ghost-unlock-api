const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const ethers = require("ethers");

let users = [
  {
    address: "0x0903CF2BDa10317A3d785f5818874CCaf36e64a9",
    email: "iamraykhell@gmail.com",
  },
];

router.post("/", (req, res, next) => {
    const codeFromURL = req.query.code;
    const email = req.body.email
    const data = JSON.parse(Buffer.from(codeFromURL, "base64"));
    console.log(`user with address ${data.d}`);
    
  const address = ethers.utils.verifyMessage(data.d, data.s);
  const user = users.find((user) => user.address === address && user.email === email);
  if (!user) {
    console.log(`user with address ${address} was not found`);
    res.status("404").send(`user with address ${address} and email: ${email} was not found`);
  } else {
    console.log(`user:: ${user.email} logged in`);
    res.render("login", { user: address });
  }
});

// reading route params
// app.get("/api/members/:id", (req, res) => {
//   res.send(req.params.id);
// });

// reading route query params
// example: http://localhost:5000/api/members/2010/1?sortBy=id
app.get("/api/members/:year/:month", (req, res) => {
  res.send(req.query);
});

// getting a single member
app.get("/api/members/:id", (req, res) => {
  // bring in members from Database
  // find member from db
  const member = members.find((m) => m.id === parseInt(req.params.id));
  // Handle req i.e not found (404), OK (200), Bad request(400)
  if (!member)
    res.status("404").send(`User with id ${req.params.id} was not found`);
  res.send(member);
});

// add a new member
app.post("/api/signup", (req, res) => {
  // get new member from request body, ideally should be in the request header
  const newMember = {
    id: req.body.id,
    name: req.body.name,
  };
  //validate
  const schema = {
    name: Joi.string().min(3).required(),
  };
  const result = Joi.validate(req.body, schema);
  //if invalid return appropriate status code and error
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }
  //add new member to members
  members.push(newMember);
  // return new member json obj to client
  res.send(newMember);
});

// update member
app.put("/api/member/edit/:id", (req, res) => {
  // look up user
  const member = members.find((m) => m.id === parseInt(req.params.id));
  const schema = {
    name: Joi.string().min(3).required(),
  };

  // if not existing return 404
  if (!member) {
    return res
      .status("404")
      .send(`User with id ${req.params.id} was not found`);
  }
  // validate
  const result = Joi.validate(req.body, schema);
  // if invalid, return 400 - bad request
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }
  // update course
  const updatedMember = {
    id: req.body.id,
    name: req.body.name,
    ...member,
  };
  members.push(updatedMember);
  // return the updated course
  res.send(updatedMember);
});

module.exports = router;
