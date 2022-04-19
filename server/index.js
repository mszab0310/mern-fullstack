const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Vehicle = require("./models/vehicle.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const multer = require("multer");
require("dotenv").config();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));
app.use(express.json());

mongoose.connect(process.env.DB_URI);

app.post(
  "/api/account/vehicle/upload",
  upload.single("image"),
  async (req, res) => {
    res.send(req.file);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

app.get("/api/account/vehicle/image/:file(*)", async (req, res) => {
  const token = req.headers["vehicle-access-token"];
  const vin = req.headers.vin;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    try {
      var photoPath = await Vehicle.findOne(
        { user_id: user._id, chassis_number: vin },
        {
          _id: 0,
          user_id: 0,
          chassis_number: 0,
          __v: 0,
          brand: 0,
          model: 0,
          bodyType: 0,
          color: 0,
          year: 0,
        }
      );
      let fileLocation = path.join("./Images", photoPath.photo);
      res.sendFile(`${fileLocation}`, { root: __dirname }, (error) => {
        if (error) {
          console.log("No photo for the car ");
        }
      });
    } catch (err) {
      console.log(err);
      console.log("Internal tc err");
      res.json({ status: "error", error: "No vehicles" });
    }
  } catch (error) {
    console.log(error);
    console.log("External tc err");

    res.json({ status: "error", error: "Invalid token" });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.post("/api/account/vehicle", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    await Vehicle.create({
      user_id: user._id,
      chassis_number: req.body.chassis_number,
      brand: req.body.brand,
      model: req.body.model,
      bodyType: req.body.bodyType,
      color: req.body.color,
      year: req.body.year,
      photo: req.body.photo,
    });
    res.json({ status: "ok", message: "Vehicle added successfully" });
  } catch (error) {
    console.log(error);
    if (error.code === 11000)
      res.json({
        status: "duplicate",
        error: "Vehicle already exists in database",
      });
    res.json({ status: error, error: "No action" });
  }
});

app.get("/api/account/vehicle", async (req, res) => {
  const token = req.headers["vehicle-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    try {
      var vehicleList = await Vehicle.find(
        { user_id: user._id },
        { _id: 0, user_id: 0, __v: 0 }
      );
      res.json({ status: "ok", vehicleList: vehicleList });
    } catch (err) {
      console.log(err);
      res.json({ status: "error", error: "No vehicles" });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid token" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return { status: "error", error: "Invalid login" };
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET
    );
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.get("/api/phoneNumber", async (req, res) => {
  const token = req.headers["x-acces-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", phoneNumber: user.phoneNumber });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.post("/api/phoneNumber", async (req, res) => {
  const token = req.headers["x-acces-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    await User.updateOne(
      { email: email },
      { $set: { phoneNumber: req.body.phoneNumber } }
    );

    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.get("/api/admin", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "admin") {
      res.json({ error: "Acces denied" });
    } else {
      res.json({ status: "ok", role: "admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid token" });
  }
});

app.get("/api/admin/getusers", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "admin") {
      res.json({ error: "Acces denied" });
    } else {
      var userList = await User.find({}, { _id: 0, password: 0, __v: 0 });
      res.json({ status: "ok", userList: userList });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid token" });
  }
});

app.delete("/api/admin/delete_user", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    console.log(req.headers.user_email);
    const user = await User.findOne({ email: email });
    if (user.role != "admin") {
      res.json({ error: "Acces denied" });
    } else {
      if (user.email != req.headers.user_email)
        try {
          const success = await User.deleteOne({
            email: req.headers.user_email,
          });
          res.json({ status: "ok", success: success });
        } catch (error) {
          console.log(error);
          res.json({ status: "error", success: false });
        }
      else res.json({ status: "error", message: "invalid operation" });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid token" });
  }
});

app.put("/api/admin/update_user_role", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "admin") {
      res.json({ error: "Acces denied" });
    } else {
      if (user.email != req.headers.user_email)
        try {
          const success = await User.updateOne(
            {
              email: req.headers.user_email,
            },
            { role: req.headers.new_role }
          );
          res.json({ status: "ok", success: success });
        } catch (error) {
          console.log(error);
          res.json({ status: "error", success: false });
        }
      else res.json({ status: "error", message: "invalid operation" });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid token" });
  }
});

app.listen(1590, () => {
  console.log("Server started on port 1590");
});
