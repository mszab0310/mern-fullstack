const mongoose = require("mongoose");

const Hours = new mongoose.Schema({
  list: [
    {
      type: String,
    },
  ],
});

const model = mongoose.model("AvailableHours", Hours);
module.exports = model;
