const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const social = new Schema({
  facebook: String,
  instagram: String,
  mail: {
    type: String,
    default: process.env.EMAIL,
  },
  github: String,
});

module.exports = mongoose.model("Social", social);
