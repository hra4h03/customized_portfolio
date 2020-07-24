const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const person = new Schema({
  name: {
    required: true,
    type: String,
  },
  surname: {
    required: true,
    type: String,
  },
  image_url: {
    required: false,
    type: String,
  },
  profession: {
    required: true,
    type: String,
  },
  background_img_url: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("Person", person);
