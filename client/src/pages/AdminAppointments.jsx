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

  const mark = ["18-05-2022", "19-05-2022", "20-05-2022"];
  const hours = ["8:00", "9:00", "10:00", "11:00", "12:00"];

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
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
          <h1>Our services</h1>
          <h4>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </h4>
        </div>
        <button onClick={handleOpen} className="appointmentButton">
          Modify appointment hours
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
            <TextField
              value={selectedDate}
              InputProps={{ readOnly: true, disableUnderline: true }}
            />
            <br />
            <Select label="Select an hour">
              {hours.map((hour) => {
                return <MenuItem value={hour}>{hour}</MenuItem>;
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

export default AdminAppointment;
