import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import Header from "./Navbar";
import "./Vehicle.css";

const UserVehicle = () => {
  const [vin, setVin] = React.useState("");
  const [src, setSrc] = React.useState("");
  const [car, setCar] = React.useState("");
  const [history, setHistory] = React.useState([]);
  const [imgBefore, setImgBefore] = React.useState(null);
  const [imgAfter, setImgAfter] = React.useState(null);
  const [openImgContainer, setOpenImgContainer] = React.useState(false);
  const [historySrc, setHistorySrc] = React.useState("");
  const [beforeImages, setBeforeImages] = React.useState([]);
  const [afterImages, setafterImages] = React.useState([]);
  const [mechanics, setMechanics] = React.useState([]);

  async function getVehicle(vin) {
    const res = await fetch(
      "http://localhost:1590/api/account/single/vehicle",
      {
        headers: {
          "user-access-token": localStorage.getItem("token"),
          vin: vin,
        },
      }
    );
    const data = await res.json();
    if (data.status === "ok") {
      setCar(data.vehicle);
    } else {
      alert("Operation failed " + data.error);
    }
  }

  async function getImage(vin) {
    const res = await fetch(
      "http://localhost:1590/api/account/vehicle/image/${imageName}",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "image/jpeg",
          "vehicle-access-token": localStorage.getItem("token"),
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

  async function getHistory(tvin) {
    const res = await fetch(
      "http://localhost:1590/api/account/vehicle/history",
      {
        headers: {
          "user-access-token": localStorage.getItem("token"),
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
      "http://localhost:1590/api/account/vehicle/history/image/before/${imageName}",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "image/jpeg",
          "user-access-token": localStorage.getItem("token"),
          vin: tvin,
          img: imgName,
        },
      }
    );
    const img = await res.blob();
    if (img != null) {
      const image = URL.createObjectURL(img);
      console.log("fetch bef" + image);
      setImgBefore(image);
      return image;
    } else {
      alert("Operation failed ");
    }
  }

  async function getAfterImage(imgName) {
    let tvin = localStorage.getItem("carVin");
    const res = await fetch(
      "http://localhost:1590/api/account/vehicle/history/image/after/${imageName}",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "image/jpeg",
          "user-access-token": localStorage.getItem("token"),
          vin: tvin,
          img: imgName,
        },
      }
    );
    const img = await res.blob();
    if (img != null) {
      const image = URL.createObjectURL(img);
      setImgAfter(image);
      console.log("fetch aft" + image);
      return image;
    } else {
      alert("Operation failed ");
      return "error";
    }
  }

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

  async function fetchMechanic(mid) {
    const res = await fetch(
      "http://localhost:1590/api/vehilce/history/mechanic",
      {
        headers: {
          "x-access-token": localStorage.getItem("token"),
          mechanic: mid,
        },
      }
    );
    const data = await res.json();
    if (data.status === "ok") {
      return data.mechanic.name;
    } else {
      alert("Operation failed " + data.error);
    }
  }

  async function fetchMechanicList() {
    const mec = await Promise.all(
      history.map((element, index) =>
        fetchMechanic(element.mechanic).then((mechanic) => {
          return mechanic;
        })
      )
    );
    setMechanics(mec);
  }

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
    fetchMechanicList();
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
        <div className="history">
          {history.map((event, index) => (
            <div key={index} className="event">
              <h2>{event.name}</h2>
              <h2>{event.description}</h2>
              <h2>{event.date}</h2>
              <h2>{mechanics[index]}</h2>
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
        <Dialog open={openImgContainer} onClose={handleImgClose}>
          <DialogContent>
            <img src={historySrc} alt="No image" />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default UserVehicle;
