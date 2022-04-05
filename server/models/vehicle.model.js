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
    trim: true,
    minlength: 17,
    maxlength: 17,
  },
  before_images: [
    {
      path: String,
    },
  ],
  after_images: [
    {
      path: String,
    },
  ],
});
