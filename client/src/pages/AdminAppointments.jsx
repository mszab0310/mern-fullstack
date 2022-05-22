import React, { useState, useEffect } from "react";
import Header from "./Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AdminAppointments.css";
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

function AdminAppointment() {
  const [value, onChange] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const maxDate = moment(Date.now()).add(1, "M");
  const [about, setAbout] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState("");
  const [hours, setHours] = useState([]);
  const [temphours, setTempHours] = useState([]);

  const mark = ["18-05-2022", "19-05-2022", "20-05-2022"];

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

  async function addHours(values) {
    alert(values);
    const res = await fetch(
      "http://localhost:1590/api/admin/appointments/hours",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          list: values,
        }),
      }
    );
    const data = await res.json();
    if (data.status === "ok") {
      alert("Hours modified successfully");
    } else {
      alert("Operation failed");
    }
  }

  useEffect(() => {
    getDetails();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const parseNewHours = (e) => {
    var hrs = e.target.value;
    setTempHours(hrs);
  };

  const handleSave = () => {
    var values = temphours.split(/\s+/);
    setHours(values);
    setOpen(false);
    addHours(values);
  };

  const onSelect = (e) => {
    var date = moment(e).format("DD-MM-YYYY");
    setSelectedDate(date);
    alert(moment(e).format("DD-MM-YYYY"));
  };

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
          Modify appointment hours
        </button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Define appointment hours</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the hours available hours which your clients can make
              appointments to. Modifications will not affect the current day.
            </DialogContentText>
            <TextField
              label="Appointment hours"
              id="outlined-textarea"
              placeholder="hh:mm"
              multiline
              onChange={parseNewHours}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminAppointment;
