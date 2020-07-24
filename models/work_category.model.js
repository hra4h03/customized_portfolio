const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Work_category = new Schema({
  name: {
    required: true,
    type: String,
  },
  description: {
    required: false,
    type: String,
  },
  works: [
    {
      type: Schema.Types.ObjectId,
      ref: "Work",
    },
  ],
});

module.exports = mongoose.model("Work_category", Work_category);
