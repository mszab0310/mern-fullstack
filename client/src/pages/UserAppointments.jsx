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
import MaterialTable from "material-table";
import tableIcons from "../components/MaterialTableIcons";

function UserAppointment() {
  const [value, onChange] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const maxDate = moment(Date.now()).add(1, "M");
  const [about, setAbout] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState("");
  const [vehicleList, setVehicleList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [hrs, setHrs] = useState([]);
  const [available, setAvailable] = useState(true);
  const [renderTable, setRenderTable] = useState(false);
  const [appointmentList, setAppointmentList] = useState([]);

  const columns = [
    { title: "Type", field: "type" },
    { title: "Date", field: "date" },
    { title: "Hour", field: "hour" },
    { title: "Vehicle chassis number", field: "vehicle_vin" },
  ];

  const handleClose = () => {
    setSelectedDate("");
    setSelectedHour("");
    setSelectedType("");
    setSelectedVehicle("");
    onChange("");
    setOpen(false);
  };

  const handleOpen = () => {
    getVehicles();
    setOpen(true);
  };

  const onSelect = (e) => {
    var date = moment(e).format("DD-MM-YYYY");
    setSelectedDate(date);
    getHours(date);
  };

  async function addAppointment() {
    const res = await fetch("http://localhost:1590/api/account/appointment", {
      method: "POST",
      headers: {
        "user-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vin: selectedVehicle.chassis_number,
        date: selectedDate,
        hour: selectedHour,
        type: selectedType,
      }),
    });
    const data = await res.json();
    if (data.status === "ok") {
      alert("Appointment created successfully");
    } else {
      alert("Operation failed");
    }
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

  async function getHours(dateSelected) {
    const res = await fetch(
      "http://localhost:1590/api/account/appointment/hours",
      {
        headers: {
          appointmentDate: dateSelected,
        },
      }
    );

    const data = await res.json();
    if (data.status === "ok") {
      console.log(data.hours);
      setHrs(data.hours);
      setAvailable(true);
    } else {
      setAvailable(false);
      alert(data.error);
    }
  }

  async function getAppointments() {
    const res = await fetch("http://localhost:1590/api/account/appointments", {
      headers: {
        "user-access-token": localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    if (data.status === "ok") {
      setAppointmentList(data.appointments);
    } else {
      alert(data.error);
    }
  }

  const selectVehicle = (e) => {
    var veh = e.target.value;
    setSelectedVehicle(veh);
  };

  const selectHour = (e) => {
    var hr = e.target.value;
    setSelectedHour(hr);
  };

  const selectType = (e) => {
    var tp = e.target.value;
    setSelectedType(tp);
  };

  const handleCreate = () => {
    addAppointment();
    setOpen(false);
  };

  const openTable = () => {
    getAppointments();
    setRenderTable(true);
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <div>
      <Header />
      <div className="appPage">
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
        <button onClick={openTable} className="appointmentButton">
          View your appointments
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
            {!available && hrs.length == 0 && (
              <h1>No available spot, please choose another day</h1>
            )}
            <InputLabel>Select an hour</InputLabel>
            {hrs.length != 0 && (
              <Select onChange={selectHour}>
                {hrs.map((hour) => {
                  return <MenuItem value={hour}>{hour}</MenuItem>;
                })}
              </Select>
            )}
            <InputLabel>Select the vehicle</InputLabel>
            <Select onChange={selectVehicle}>
              {vehicleList.map((vehicle) => {
                return (
                  <MenuItem value={vehicle}>
                    {vehicle.brand} {vehicle.model} {vehicle.licensePlate}
                  </MenuItem>
                );
              })}
            </Select>
            <InputLabel>Type of work</InputLabel>
            <Select onChange={selectType}>
              <MenuItem value="Routine">Routine</MenuItem>
              <MenuItem value="Repair or change">Repair or change</MenuItem>
              <MenuItem value="Else">Else</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleCreate}>Create appointment</Button>
          </DialogActions>
        </Dialog>
        {renderTable && (
          <MaterialTable
            title="Your Appointments"
            columns={columns}
            icons={tableIcons}
            data={appointmentList}
          />
        )}
      </div>
    </div>
  );
}

export default UserAppointment;
