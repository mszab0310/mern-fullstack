const mongoose = require("mongoose");

const Appointment = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mechanic_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  vehicle_vin: {
    type: String,
    maxlength: 17,
    minlength: 17,
  },
  date: {
    type: String,
  },
  hour: {
    type: String,
  },
  type: {
    type: String,
  },
});

const model = mongoose.model("Appointments", Appointment);
module.exports = model;
