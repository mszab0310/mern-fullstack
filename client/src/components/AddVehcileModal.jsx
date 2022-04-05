import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const AddVehicleModal = () => {
  const [open, setOpen] = React.useState(false);
  const [vin, setVin] = React.useState("");
  const [validVin, setValidVin] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [validBrand, setValidBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [validModel, setValidModel] = React.useState("");
  const [year, setYear] = React.useState("");
  const [validYear, setValidYear] = React.useState("");

  async function addVehicle() {
    const req = await fetch("http://localhost:1590/api/account/vehicle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({}),
    });
  }

  const addVin = (event) => {
    setVin(event.target.value);
  };

  const addBrand = (event) => {
    setBrand(event.target.value);
  };

  const addModel = (event) => {
    setModel(event.target.value);
  };

  const addYear = (event) => {
    setYear(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    if (
      vin.length == 17 &&
      brand.length > 0 &&
      model.length > 0 &&
      parseInt(year) >= 1980
    ) {
      setOpen(false);
      alert(vin + " " + brand + " " + model + " " + year);
    } else {
      //TODO Validate input fields and show error if not correct
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Vehicle
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Vehicle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your vehicles data correctly. Once submitted, it can
            not be changed. Fields marked with * are required!
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Chassis number (VIN)"
            type="text"
            fullWidth
            variant="standard"
            onChange={addVin}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Vehicle Brand"
            type="text"
            fullWidth
            variant="standard"
            onChange={addBrand}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Vehicle model"
            type="text"
            fullWidth
            variant="standard"
            onChange={addModel}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Fabrication year"
            type="text"
            fullWidth
            variant="standard"
            onChange={addYear}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddVehicleModal;
