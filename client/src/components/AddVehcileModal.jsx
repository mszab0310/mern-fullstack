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
  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [year, setYear] = React.useState("");
  const [file, setFile] = React.useState(null);

  async function addVehicle() {
    let formData = new FormData();
    formData.append("image", file);
    const req = await fetch("http://localhost:1590/api/account/vehicle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        chassis_number: vin,
        brand: brand,
        model: model,
        year: year,
        image: formData,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      alert("succes");
    } else {
      if (data.status === "duplicate") {
        alert(data.error);
      } else alert("Operation failed");
    }
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
      vin.length === 17 &&
      brand.length > 0 &&
      model.length > 0 &&
      parseInt(year) >= 1980
    ) {
      setOpen(false);
      alert(vin + " " + brand + " " + model + " " + year);
      if (file != null) {
        console.log(file, "State FILE ---- $$$$");
      }
      addVehicle();
      setVin("");
      setBrand("");
      setModel("");
      setYear("");
    } else {
      alert("Please fill out all fields correctly!");
    }
  };

  const handleFile = (e) => {
    let img = e.target.files[0];
    setFile(img);
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
          <lable>Upload an image of your vehicle (optional)</lable>
          <br />
          <input type="file" name="image" onChange={handleFile} />
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
