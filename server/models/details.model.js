const mongoose = require("mongoose");

const Details = new mongoose.Schema({
  services: {
    type: String,
  },
  about: {
    type: String,
  },
  contact: {
    type: String,
  },
});

const model = mongoose.model("PlatformDetails", Details);
module.exports = model;
