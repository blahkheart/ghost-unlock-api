const express = require("express");
// const { verify } = require("jsonwebtoken");
const router = express.Router();
// const { users } = require("../config/users");
const { verifyUser } = require("../controllers/userController");
const {parseQueryParams} = require("../middleware/parseQueryParams")

// const parseQueryParams = (req, res, next) => {
//   req.parsedParams = {
//     address: req.query.address,
//     action: req.query.action,
//   };
//   next();
// };

/* @desc verify user
*  @route GET /signup/verify
*  @access public
*/

// router.get("/auth/verify/:email", parseQueryParams, function (req, res, next) {
//   try {
//     /** TODOs 
//     * validate email address 
//     **/

//     // get user data from req
//     const email = req.params.email;
//     const address = req.parsedParams.address;
//     const action = req.parsedParams.action;

//     // replace with db connection
//     // get user with matching email & address from DB
//     const user = users.map((user) => {
//       if (user.address === address && user.email === email) {
//         return user;
//       } else {
//         return {};
//       }
//     })[0];

//     let _index;
//     if (!user) {
//       res.status(404).end();
//     } else {
//       _index = users.indexOf(user);
//     }

//     if (action === "signup" || action === "subscribe") {
//       user.emailVerified = true;
//       // update user info in db
//       users[_index] = user;
//       res.status(200).end();
//     } else if (action === "signin" && user.emailVerified === false) {
//       // console.log("USERXX", user)
//       res.status(403).end()
//     } else {
//       res.status(200).end();
//     }
//   } catch (e) {
//     console.log("AUTH VERIFY ERR: ", e.message);
//   }
// });
router.get("/auth/verify/:email", parseQueryParams, verifyUser);

module.exports = router;
