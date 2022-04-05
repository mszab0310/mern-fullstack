const mongoose = require("mongoose");

const Vehcile = new mongoose.Schema({
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
  year: {
    type: Number,
    min: 1980,
  },
});
