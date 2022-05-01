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
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [currency, setCurrency] = React.useState("");
  const [before, setBefore] = React.useState(null);
  const [after, setAfter] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [history, setHistory] = React.useState([]);
  const [uploadStatus, setUploadStatus] = React.useState("");
  const [beforeImages, setBeforeImages] = React.useState([]);
  const [afterImages, setafterImages] = React.useState([]);
  const [imgBefore, setImgBefore] = React.useState(null);
  const [imgAfter, setImgAfter] = React.useState(null);
  const [openImgContainer, setOpenImgContainer] = React.useState(false);
  const [historySrc, setHistorySrc] = React.useState("");

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

  async function addRepair() {
    let befIMG = "before_" + vin + "_" + date + ".jpg";
    let aftIMG = "after_" + vin + "_" + date + ".jpg";
    const req = await fetch(
      "http://localhost:1590/api/mechanic/vehicle/history",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          vehicle_vin: vin,
          name: name,
          description: description,
          date: date,
          price: price,
          currency: currency,
          before: befIMG,
          after: aftIMG,
        }),
      }
    );
    const data = await req.json();
    if (data.status === "ok") {
      alert("Repair added");
    } else {
      alert("operation failed");
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

  async function uploadBefore() {
    let formData = new FormData();
    let newName = "before_" + vin + "_" + date + ".jpg";
    formData.append("image", before, newName);
    const req = await fetch(
      "http://localhost:1590/api/mechanic/vehicle/history/pic",
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

  async function uploadAfter() {
    let formData = new FormData();
    let newName = "after_" + vin + "_" + date + ".jpg";
    formData.append("image", after, newName);
    const req = await fetch(
      "http://localhost:1590/api/mechanic/vehicle/history/pic",
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

  async function getHistory(tvin) {
    const res = await fetch(
      "http://localhost:1590/api/mechanic/vehicle/history",
      {
        headers: {
          "mechanic-access-token": localStorage.getItem("token"),
          vin: tvin,
        },
      }
    );
    const data = await res.json();
    if (data.status === "ok") {
      let h = data.history;
      setHistory(h);
    } else {
      alert("Operation failed " + data.error);
    }
  }

  async function getBeforeImage(imgName) {
    let tvin = localStorage.getItem("carVin");
    const res = await fetch(
      "http://localhost:1590/api/mechanic/vehicle/history/image/before/${imageName}",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "image/jpeg",
          "mechanic-access-token": localStorage.getItem("token"),
          vin: tvin,
          img: imgName,
        },
      }
    );
    const img = await res.blob();
    if (img != null) {
      const image = URL.createObjectURL(img);
      setImgBefore(image);
      return image;
    } else {
      alert("Operation failed ");
    }
  }

  async function getAfterImage(imgName) {
    let tvin = localStorage.getItem("carVin");
    const res = await fetch(
      "http://localhost:1590/api/mechanic/vehicle/history/image/after/${imageName}",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "image/jpeg",
          "mechanic-access-token": localStorage.getItem("token"),
          vin: tvin,
          img: imgName,
        },
      }
    );
    const img = await res.blob();
    if (img != null) {
      const image = URL.createObjectURL(img);
      setImgAfter(image);
      return image;
    } else {
      alert("Operation failed ");
      return "error";
    }
  }

  const addName = (event) => {
    setName(event.target.value);
  };
  const addDescription = (event) => {
    setDescription(event.target.value);
  };
  const addDate = (event) => {
    setDate(event.target.value);
  };
  const addPrice = (event) => {
    setPrice(event.target.value);
  };
  const addCurrency = (event) => {
    setCurrency(event.target.value);
  };
  const addBefore = (event) => {
    let b = event.target.files[0];
    setBefore(b);
  };
  const addAfter = (event) => {
    let a = event.target.files[0];
    setAfter(a);
  };

  const handleNewEvent = () => {
    setOpen(true);
  };

  const handleSubmit = () => {
    addRepair();
    if (before != null && after != null) {
      uploadBefore();
      uploadAfter();
    }
    setOpen(false);
    window.location.reload(true);
  };

  async function fetchImages() {
    const bef = await Promise.all(
      history.map((element, index) =>
        getBeforeImage(element.before).then((image) => {
          return image;
        })
      )
    );
    console.log(bef);
    const aft = await Promise.all(
      history.map((element, index) =>
        getAfterImage(element.after).then((image) => {
          return image;
        })
      )
    );
    console.log(aft);
    setBeforeImages(bef);
    setafterImages(aft);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleImgClose = () => {
    setOpenImgContainer(false);
    setHistorySrc("");
  };

  useEffect(() => {
    var tempVin = localStorage.getItem("carVin");
    setVin(tempVin);
    getImage(tempVin);
    getVehicle(tempVin);
    getHistory(tempVin);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [history]);

  return (
    <>
      <Header />
      <div className="page">
        <div className="vehicleCard">
          <h1>
            {car.brand} {car.model}
          </h1>
          <img src={src} className="carPicture" alt="not found" />
          <div className="title">
            <h2>Descirption:</h2>
            <h3> Body: {car.bodyType}</h3>
            <h3> Color: {car.color}</h3>
            <h3> Fabrication year: {car.year}</h3>
            <h3> Cilinder capacity: {car.cilinderCapacity}</h3>
            <h3> Fuel type: {car.fuel}</h3>
            <h3> License Plate: {car.licensePlate}</h3>
          </div>
        </div>
        <h1>Repair History:</h1>
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
              onChange={addName}
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
              onChange={addDescription}
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
              onChange={addDate}
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
              onChange={addPrice}
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
              onChange={addCurrency}
            />
            <label>Upload before image</label>
            <br />
            <input type="file" name="image" onChange={addBefore} />
            <br />
            <label>Upload after image</label>
            <br />
            <input type="file" name="image" onChange={addAfter} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
        <div className="history">
          {history.map((event, index) => (
            <div key={index} className="event">
              <h2>{event.name}</h2>
              <h2>{event.description}</h2>
              <h2>{event.date}</h2>
              <h2>
                {event.price} {event.currency}
              </h2>
              <div className="buttonContainer">
                <Button
                  onClick={() => {
                    setOpenImgContainer(true);
                    setHistorySrc(beforeImages[index]);
                  }}
                >
                  Before
                </Button>
                <Button
                  onClick={() => {
                    setOpenImgContainer(true);
                    setHistorySrc(afterImages[index]);
                  }}
                >
                  After
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={handleNewEvent}>Add new event</Button>
        <Dialog open={openImgContainer} onClose={handleImgClose}>
          <DialogContent>
            <img src={historySrc} alt="No image" />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Vehicle;
