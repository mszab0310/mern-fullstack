import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MenuItem } from "@mui/material";
import { InputLabel, Select } from "@material-ui/core";

const AddVehicleModal = () => {
  const [open, setOpen] = React.useState(false);
  const [vin, setVin] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [year, setYear] = React.useState("");
  const [color, setColor] = React.useState("");
  const [bodyType, setBodyType] = React.useState("Body type");
  const [file, setFile] = React.useState(null);
  const [uploadStatus, setUploadStatus] = React.useState("");

  async function addVehicle() {
    let newName = "stock_" + vin + "_" + ".jpg";
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
        bodyType: bodyType,
        color: color,
        year: year,
        photo: newName,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      alert("succes");
      debugger;
    } else {
      if (data.status === "duplicate") {
        alert(data.error);
      } else alert("Operation failed");
    }
  }

  async function uploadImage() {
    let formData = new FormData();
    let newName = "stock_" + vin + "_" + ".jpg";
    formData.append("image", file, newName);
    const req = await fetch(
      "http://localhost:1590/api/account/vehicle/upload",
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "multipart/form-data",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setUploadStatus(res.msg);
      })
      .catch((err) => console.error(err));
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

  const addColor = (event) => {
    setColor(event.target.value);
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
      if (file != null) {
        console.log(file, "State FILE ---- $$$$");
        uploadImage();
      }
      addVehicle();
      setVin("");
      setBrand("");
      setModel("");
      setColor("");
      setYear("");
    } else {
      alert("Please fill out all fields correctly!");
    }
  };

  const handleFile = (e) => {
    let img = e.target.files[0];
    setFile(img);
  };

  const selectBodyType = (event) => {
    setBodyType(event.target.value);
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
          <InputLabel>Body Type</InputLabel>
          <Select
            value={bodyType}
            autofocus
            required
            label="Body Type"
            onChange={selectBodyType}
          >
            <MenuItem value="Convertible">Convertible</MenuItem>
            <MenuItem value="Coupe">Coupe</MenuItem>
            <MenuItem value="Crossover">Crossover</MenuItem>
            <MenuItem value="Hatchback">Hatchback</MenuItem>
            <MenuItem value="Micro Car">Micro Car</MenuItem>
            <MenuItem value="Minivan">Minivan</MenuItem>
            <MenuItem value="Pickup">Pickup</MenuItem>
            <MenuItem value="Roadster">Roadster</MenuItem>
            <MenuItem value="Sedan">Sedan</MenuItem>
            <MenuItem value="SUV">SUV</MenuItem>
            <MenuItem value="Truck">Truck</MenuItem>
            <MenuItem value="VAN">VAN</MenuItem>
            <MenuItem value="Wagon">Wagon</MenuItem>
          </Select>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Vehicle color"
            type="text"
            fullWidth
            variant="standard"
            onChange={addColor}
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
          <label>Upload an image of your vehicle (optional)</label>
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
