const mongoose = require("mongoose");

const Vehicle = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chassis_number: {
    type: String,
    required: true,
    uppercase: true,
    unique: true,
    trim: true,
    minlength: 17,
    maxlength: 17,
  },
  brand: {
    type: String,
    maxlength: 35,
  },
  model: {
    type: String,
  },
  bodyType: {
    type: String,
  },
  color: {
    type: String,
    maxlength: 30,
  },
  year: {
    type: Number,
    min: 1980,
  },
  photo: {
    type: String,
  },
});

const model = mongoose.model("VehicleData", Vehicle);
module.exports = model;
