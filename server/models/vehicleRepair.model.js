const mongoose = require("mongoose");

const VehicleRepair = new mongoose.Schema({
  vehicle_vin: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    minlength: 17,
    maxlength: 17,
  },
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    maxlength: 45,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    maxlength: 150,
    trim: true,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    maxlength: 3,
    trim: true,
    required: true,
  },
  before: {
    type: String,
  },
  after: {
    type: String,
  },
});

const model = mongoose.model("RepairData", VehicleRepair);
module.exports = model;
