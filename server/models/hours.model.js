const mongoose = require("mongoose");

const Hours = new mongoose.Schema({
  list: [
    {
      type: String,
    },
  ],
});
