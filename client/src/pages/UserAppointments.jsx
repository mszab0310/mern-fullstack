import React, { useState, useEffect } from "react";
import Header from "./Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./UserAppointments.css";
import moment from "moment";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MenuItem } from "@mui/material";
import { InputLabel, Select } from "@material-ui/core";
import SelectInput from "@mui/material/Select/SelectInput";

function UserAppointment() {
  const [value, onChange] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const maxDate = moment(Date.now()).add(1, "M");
  const [about, setAbout] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState("");
  const [vehicleList, setVehicleList] = useState([]);

  const mark = ["18-05-2022", "19-05-2022", "20-05-2022"];
  const hours = ["8:00", "9:00", "10:00", "11:00", "12:00"];

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    getVehicles();
    setOpen(true);
  };

  const onSelect = (e) => {
    var date = moment(e).format("DD-MM-YYYY");
    setSelectedDate(date);
    alert(moment(e).format("DD-MM-YYYY"));
  };

  async function addAppointment() {
    const req = await fetch("http://localhost:1590/api/account/appointment", {
      method: "POST",
    });
  }

  async function getDetails() {
    const res = await fetch("http://localhost:1590/api/details", {
      method: "GET",
    });
    const data = await res.json();
    if (data.status === "ok") {
      let information = data.details;
      let abt = information.about;
      setAbout(abt);
      let serv = information.services;
      setServices(serv);
      let cont = information.contact;
      setContact(cont);
    } else {
      alert("Problem found");
    }
  }

  async function getVehicles() {
    const res = await fetch("http://localhost:1590/api/account/vehicle", {
      headers: {
        "vehicle-access-token": localStorage.getItem("token"),
      },
    });
    const data = await res.json();
    if (data.status === "ok") {
      let vehicles = data.vehicleList;
      setVehicleList(vehicles);
    } else {
      alert("Operation failed " + data.error);
    }
  }

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <div>
      <Header />
      <div className="page">
        <div className="textBox">
          <h1>About us</h1>
          <h4>{about}</h4>
          <h1>Our services</h1>
          <h4>{services}</h4>
          <h1>Contact details</h1>
          <h4>{contact}</h4>
        </div>
        <button onClick={handleOpen} className="appointmentButton">
          Make an appointment
        </button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Make an appointment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your vehicles data correctly. Once submitted, it can
              not be changed. Fields marked with * are required!
            </DialogContentText>
            <Calendar
              onChange={onChange}
              value={value}
              tileClassName={({ date, view }) => {
                if (mark.find((x) => x === moment(date).format("DD-MM-YYYY"))) {
                  return "highlight";
                }
              }}
              tileDisabled={({ date }) => date.getDay() === 0}
              maxDate={new Date(maxDate)}
              minDate={new Date()}
              onClickDay={onSelect}
            />
            <InputLabel>Date</InputLabel>
            <TextField
              value={selectedDate}
              InputProps={{ readOnly: true, disableUnderline: true }}
            />
            <br />
            <InputLabel>Select an hour</InputLabel>
            <Select>
              {hours.map((hour) => {
                return <MenuItem value={hour}>{hour}</MenuItem>;
              })}
            </Select>
            <InputLabel>Select the vehicle</InputLabel>
            <Select>
              {vehicleList.map((vehicle) => {
                return (
                  <MenuItem value={vehicle.brand}>
                    {vehicle.brand} {vehicle.model} {vehicle.licensePlate}
                  </MenuItem>
                );
              })}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default UserAppointment;
