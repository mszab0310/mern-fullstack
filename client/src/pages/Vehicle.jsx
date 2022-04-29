import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import Header from "./Navbar";
import "./Vehicle.css";
import { InputLabel } from "@material-ui/core";

const Vehicle = () => {
  const [vin, setVin] = React.useState("");
  const [src, setSrc] = React.useState("");
  const [car, setCar] = React.useState("");
  const [open, setOpen] = React.useState(false);

  async function getVehicle(vin) {
    const res = await fetch("http://localhost:1590/api/mechanic/vehicle", {
      headers: {
        "mechanic-access-token": localStorage.getItem("token"),
        vin: vin,
      },
    });
    const data = await res.json();
    if (data.status === "ok") {
      setCar(data.vehicle);
    } else {
      alert("Operation failed " + data.error);
    }
  }

  async function getImage(vin) {
    const res = await fetch(
      "http://localhost:1590/api/mechanic/vehicle/image/${imageName}",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "image/jpeg",
          "mechanic-access-token": localStorage.getItem("token"),
          vin: vin,
        },
      }
    );
    const img = await res.blob();
    if (img != null) {
      const image = URL.createObjectURL(img);
      setSrc(image);
    } else {
      alert("Operation failed ");
    }
  }
  const handleNewEvent = () => {
    setOpen(true);
  };

  const handleSubmit = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    var tempVin = localStorage.getItem("carVin");
    setVin(tempVin);
    getImage(tempVin);
    getVehicle(tempVin);
  }, []);

  return (
    <>
      <Header />
      <div className="page">
        <div className="vehicleCard">
          <img src={src} className="carPicture" />
          <div className="title">
            <h1>
              {car.brand} {car.model}
            </h1>
            <h2>Descirption:</h2>
            <h3> Body: {car.bodyType}</h3>
            <h3> Color: {car.color}</h3>
            <h3> Fabrication year: {car.year}</h3>
            <h3> Cilinder capacity: {car.cilinderCapacity}</h3>
            <h3> Fuel type: {car.fuel}</h3>
            <h3> License Plate: {car.licensePlate}</h3>
          </div>
          <Button onClick={handleNewEvent}>Add new event</Button>
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Vehicle Repair Event</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the repair data correctly. Once submitted, it can not
              be changed. Fields marked with * are required!
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              label="Repair Title"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
            />
            <InputLabel required>Date</InputLabel>
            <TextField
              autoFocus
              required
              margin="dense"
              placeholder="Date"
              id="name"
              type="date"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              label="Price"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              label="Currency (ISO 3)"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Vehicle;
