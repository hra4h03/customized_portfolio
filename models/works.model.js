const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workModel = new Schema({
  url: {
    required: false,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  image_url: {
    required: true,
    type: String,
  },
});

const wholeWorkModel = new Schema({
  work_text: {
    required: false,
    type: String,
  },
  works: [workModel],
});

module.exports = mongoose.model("Work", wholeWorkModel);
