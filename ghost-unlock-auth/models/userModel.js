const mongoose = require("mongoose");

const userModel = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerified: {
    type: Boolean,
  },
},
{
  timestamps: true
});

module.exports = mongoose.model("User", userModel);
