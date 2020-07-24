const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workModel = new Schema({
  name: {
    required: true,
    type: String,
  },
  image_url: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("Work", workModel);
