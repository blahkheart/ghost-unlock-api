const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "de9546c556f63a",
    pass: "a68eee6ddc87d0",
  },
});

module.exports = {
  transporter,
};
