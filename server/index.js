const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Vehicle = require("./models/vehicle.model");
const VehicleRepair = require("./models/vehicleRepair.model.js");
const Details = require("./models/details.model.js");
const Appointment = require("./models/appointment.model.js");
const Hours = require("./models/hours.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const multer = require("multer");
const { resolveAny } = require("dns/promises");
const { application } = require("express");
require("dotenv").config();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const roles = ["user", "admin", "mechanic"];
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

app.post(
  "/api/mechanic/vehicle/history/pic",
  upload.single("image"),
  async (req, res) => {
    res.send(req.file);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

app.get("/api/vehilce/history/mechanic", async (req, res) => {
  const token = req.headers["x-access-token"];
  const m_id = req.headers.mechanic;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.json({ status: "error", error: "error" });
    } else {
      try {
        const mechanic = await User.findOne(
          { _id: m_id },
          { _id: 0, password: 0, __v: 0, role: 0 }
        );
        res.json({ status: "ok", mechanic: mechanic });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "error" });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: err });
  }
});

app.get("/api/mechanic/vehicle/history", async (req, res) => {
  const token = req.headers["mechanic-access-token"];
  const vin = req.headers.vin;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "mechanic") {
      res.json({ error: "Access denied" });
    } else {
      try {
        var history = await VehicleRepair.find(
          { vehicle_vin: vin },
          { _id: 0, __v: 0 }
        );
        res.json({ status: "ok", history: history });
      } catch (error) {
        console.log(error);
        res.json({ error: "No history" });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({ error: "No user found" });
  }
});

app.get("/api/account/vehicle/history", async (req, res) => {
  const token = req.headers["user-access-token"];
  const vin = req.headers.vin;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "user") {
      res.json({ error: "Access denied" });
    } else {
      try {
        var history = await VehicleRepair.find(
          { vehicle_vin: vin },
          { _id: 0, __v: 0 }
        );
        res.json({ status: "ok", history: history });
      } catch (error) {
        console.log(error);
        res.json({ error: "No history" });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({ error: "No user found" });
  }
});

app.get("/api/mechanic/vehicles", async (req, res) => {
  const token = req.headers["mechanic-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "mechanic") {
      res.json({ error: "Access denied" });
    } else {
      try {
        var allVehicles = await Vehicle.find(
          {},
          { _id: 0, user_id: 0, __v: 0 }
        );
        res.json({ status: "ok", vehicleList: allVehicles });
      } catch (error) {
        console.log(error);
        res.json({ error: "No vehicles to display" });
      }
    }
  } catch (err) {
    res.json({ error: "No user found" });
  }
});

app.get("/api/mechanic/vehicle", async (req, res) => {
  const token = req.headers["mechanic-access-token"];
  const vin = req.headers.vin;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "mechanic") {
      res.json({ error: "Access denied" });
    } else {
      try {
        var vehicle = await Vehicle.findOne(
          { chassis_number: vin },
          { _id: 0, __v: 0 }
        );
        var owner = await User.findOne(
          { _id: vehicle.user_id },
          { password: 0, role: 0 }
        );
        res.json({ status: "ok", vehicle: vehicle, owner: owner });
      } catch (error) {
        console.log(error);
        res.json({ error: "No vehicle to display" });
      }
    }
  } catch (err) {
    res.json({ error: "No user found" });
  }
});

app.get("/api/account/single/vehicle", async (req, res) => {
  const token = req.headers["user-access-token"];
  const vin = req.headers.vin;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "user") {
      res.json({ error: "Access denied" });
    } else {
      try {
        var vehicle = await Vehicle.findOne(
          { chassis_number: vin },
          { _id: 0, user_id: 0, __v: 0 }
        );
        res.json({ status: "ok", vehicle: vehicle });
      } catch (error) {
        console.log(error);
        res.json({ error: "No vehicle to display" });
      }
    }
  } catch (err) {
    res.json({ error: "No user found" });
  }
});

app.get(
  "/api/mechanic/vehicle/history/image/before/:file(*)",
  async (req, res) => {
    const token = req.headers["mechanic-access-token"];
    const vin = req.headers.vin;
    const imgName = req.headers.img;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
      const user = await User.findOne({ email: email });
      try {
        var photoPath = await VehicleRepair.findOne(
          { vehicle_vin: vin, before: imgName },
          {
            _id: 0,
            vehicle_vin: 0,
            mechanic: 0,
            name: 0,
            description: 0,
            date: 0,
            price: 0,
            currency: 0,
            after: 0,
            __v: 0,
          }
        );
        let fileLocation = path.join("./Images", photoPath.before);
        res.sendFile(`${fileLocation}`, { root: __dirname }, (error) => {
          if (error) {
            console.log("No photo for the event" + error);
          }
        });
      } catch (err) {
        console.log(err);
        console.log("Internal tc err");
        res.json({ status: "error", error: "No history" });
      }
    } catch (error) {
      console.log(error);
      console.log("External tc err");
      res.json({ status: "error", error: "Invalid token" });
    }
  }
);

app.get(
  "/api/account/vehicle/history/image/before/:file(*)",
  async (req, res) => {
    const token = req.headers["user-access-token"];
    const vin = req.headers.vin;
    const imgName = req.headers.img;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
      const user = await User.findOne({ email: email });
      try {
        var photoPath = await VehicleRepair.findOne(
          { vehicle_vin: vin, before: imgName },
          {
            _id: 0,
            vehicle_vin: 0,
            mechanic: 0,
            name: 0,
            description: 0,
            date: 0,
            price: 0,
            currency: 0,
            after: 0,
            __v: 0,
          }
        );
        let fileLocation = path.join("./Images", photoPath.before);
        res.sendFile(`${fileLocation}`, { root: __dirname }, (error) => {
          if (error) {
            console.log("No photo for the event" + error);
          }
        });
      } catch (err) {
        console.log(err);
        console.log("Internal tc err");
        res.json({ status: "error", error: "No history" });
      }
    } catch (error) {
      console.log(error);
      console.log("External tc err");
      res.json({ status: "error", error: "Invalid token" });
    }
  }
);

app.get(
  "/api/mechanic/vehicle/history/image/after/:file(*)",
  async (req, res) => {
    const token = req.headers["mechanic-access-token"];
    const vin = req.headers.vin;
    const imgName = req.headers.img;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
      const user = await User.findOne({ email: email });
      try {
        var photoPath = await VehicleRepair.findOne(
          { vehicle_vin: vin, after: imgName },
          {
            _id: 0,
            vehicle_vin: 0,
            mechanic: 0,
            name: 0,
            description: 0,
            date: 0,
            price: 0,
            currency: 0,
            before: 0,
            __v: 0,
          }
        );

        let fileLocation = path.join("./Images", photoPath.after);
        res.sendFile(`${fileLocation}`, { root: __dirname }, (error) => {
          if (error) {
            console.log("No photo for the event" + error);
          }
        });
      } catch (err) {
        console.log(err);
        console.log("Internal tc err");
        res.json({ status: "error", error: "No history" });
      }
    } catch (error) {
      console.log(error);
      console.log("External tc err");
      res.json({ status: "error", error: "Invalid token" });
    }
  }
);

app.get(
  "/api/account/vehicle/history/image/after/:file(*)",
  async (req, res) => {
    const token = req.headers["user-access-token"];
    const vin = req.headers.vin;
    const imgName = req.headers.img;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
      const user = await User.findOne({ email: email });
      try {
        var photoPath = await VehicleRepair.findOne(
          { vehicle_vin: vin, after: imgName },
          {
            _id: 0,
            vehicle_vin: 0,
            mechanic: 0,
            name: 0,
            description: 0,
            date: 0,
            price: 0,
            currency: 0,
            before: 0,
            __v: 0,
          }
        );

        let fileLocation = path.join("./Images", photoPath.after);
        res.sendFile(`${fileLocation}`, { root: __dirname }, (error) => {
          if (error) {
            console.log("No photo for the event" + error);
          }
        });
      } catch (err) {
        console.log(err);
        console.log("Internal tc err");
        res.json({ status: "error", error: "No history" });
      }
    } catch (error) {
      console.log(error);
      console.log("External tc err");
      res.json({ status: "error", error: "Invalid token" });
    }
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

app.get("/api/mechanic/vehicle/image/:file(*)", async (req, res) => {
  const token = req.headers["mechanic-access-token"];
  const vin = req.headers.vin;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "admin" && user.role != "mechanic") {
      res.json({ error: "Access denied" });
    } else {
      try {
        var photoPath = await Vehicle.findOne(
          { chassis_number: vin },
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
            console.log(error + " No photo for the car ");
          }
        });
      } catch (err) {
        res.json({ status: "error", error: "No vehicles" });
      }
    }
  } catch (error) {
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
      cilinderCapacity: req.body.cilinderCapacity,
      fuel: req.body.fuel,
      year: req.body.year,
      photo: req.body.photo,
      licensePlate: req.body.licensePlate,
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

app.post("/api/mechanic/vehicle/history", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "mechanic") {
      res.json({ status: "error", message: "Access denied" });
    } else {
      await VehicleRepair.create({
        vehicle_vin: req.body.vehicle_vin,
        mechanic: user._id,
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        price: req.body.price,
        currency: req.body.currency,
        before: req.body.before,
        after: req.body.after,
      });
      res.json({ status: "ok", message: "Vehicle added successfully" });
    }
  } catch (error) {
    console.log(error);
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

app.get("/api/mechanic", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "mechanic") {
      res.json({ error: "Acces denied" });
    } else {
      res.json({ status: "ok", role: "mechanic" });
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
      if (
        user.email != req.headers.user_email &&
        roles.includes(req.headers.new_role)
      )
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

app.post("/api/admin/details", async (req, res) => {
  const token = req.headers["admin-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "admin") {
      return res.json({ status: "error", error: "Access denied" });
    } else {
      try {
        const success = await Details.collection.drop();
        if (success) {
          await Details.create({
            services: req.body.services,
            about: req.body.about,
            contact: req.body.contact,
          });
          return res.json({
            status: "ok",
            message: "Details added succesfully",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.get("/api/details", async (req, res) => {
  try {
    const details = await Details.findOne();
    return res.json({ status: "ok", details: details });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", error: error });
  }
});

app.post("/api/account/appointment", async (req, res) => {
  const token = req.headers["user-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    try {
      await Appointment.create({
        user_id: user._id,
        vehicle_vin: req.body.vin,
        date: req.body.date,
        hour: req.body.hour,
        type: req.body.type,
      });
      return res.json({
        status: "ok",
        message: "Appointment created succesfully",
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.post("/api/admin/appointments/hours", async (req, res) => {
  const token = req.headers["admin-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role != "admin") {
      return res.json({ status: "error", error: "Access denied" });
    } else {
      try {
        const success = await Hours.collection.drop();
        if (success) {
          console.log(req.body.list);
          await Hours.create({
            list: req.body.list,
          });
          return res.json({
            status: "ok",
            message: "Hours added succesfully",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.get("/api/account/appointment/hours", async (req, res) => {
  var list = [];
  const token = req.headers["user-access-token"];
  const date = req.headers.date;
  try {
    var hrs = await Hours.findOne();
    list = hrs.list;
    console.log(list);
  } catch (error) {
    return res.json({ status: "error", error: "service down" });
  }
  console.log("date " + date);
  try {
    var apps = await Appointment.find({ date: date });
    if (apps.length != 0 && list.length != 0) {
      apps.forEach((appt) => {
        var index = list.indexOf(appt.hour);
        if (index != -1) list.splice(index, 1);
      });
      if (list.length != 0) {
        return res.json({ status: "ok", hours: list });
      } else {
        return res.json({ status: "error", error: "No available hours" });
      }
    } else return res.json({ status: "error", error: "operationfailed" });
  } catch (error) {
    return res.json({ status: "error", error: "service down" });
  }
});

app.listen(1590, () => {
  console.log("Server started on port 1590");
});
