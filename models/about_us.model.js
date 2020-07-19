const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const what_i_do_item = new Schema({
  name: {
    required: true,
    type: String,
  },
});

const about_us = new Schema({
  who_i_am: {
    text: {
      required: true,
      type: String,
    },
    image_url: {
      required: false,
      type: String,
    },
  },
  what_i_do: [what_i_do_item],
});

module.exports = mongoose.model("AboutUs", about_us);
