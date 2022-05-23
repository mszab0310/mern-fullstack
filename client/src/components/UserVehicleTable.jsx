import MaterialTable from "material-table";
import React, { useEffect } from "react";
import { useState } from "react";
import tableIcons from "./MaterialTableIcons";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./UserVehicleTable.css";
import { useNavigate } from "react-router-dom";

const UserVehicleTable = () => {
  const [vehicleList, setVehicleList] = useState([]);
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState(null);
  const navigate = useNavigate();

  const columns = [
    { title: "Chassis Number", field: "chassis_number" },
    { title: "Brand", field: "brand" },
    { title: "Model", field: "model" },
    { title: "Body Type", field: "bodyType" },
    { title: "Color", field: "color" },
    { title: "Cilinder capacity", field: "cilinderCapacity" },
    { title: "Fuel type", field: "fuel" },
    { title: "Fabrication year", field: "year", type: "numeric" },
    { title: "License Plate", field: "licensePlate" },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "black",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxWidth: "50%",
    maxHeight: "50%",
  };

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
      setSource(image);
    } else {
      alert("Operation failed ");
    }
  }

  const handleImageButton = (event, rowData) => {
    getImage(rowData.chassis_number);
    setOpen(true);
  };

  function handleHistoryButton(event, rowData) {
    localStorage.setItem("carVin", rowData.chassis_number);
    navigate("/user/vehicle", { replace: true });
  }

  const handleClose = () => {
    setOpen(false);
    setSource("");
  };

  useEffect(() => {
    getVehicles();
  }, []);

  return (
    <div className="page">
      <MaterialTable
        title="Your Vehicles"
        columns={columns}
        icons={tableIcons}
        data={vehicleList}
        actions={[
          {
            icon: tableIcons.ImageIcon,
            tooltip: "View Image",
            onClick: (event, rowData) => {
              handleImageButton(event, rowData);
            },
          },
          {
            icon: tableIcons.DirectionsCarIconn,
            tooltip: "View Vehicle Page",
            onClick: (event, rowData) => {
              handleHistoryButton(event, rowData);
            },
          },
        ]}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img className="vehicleImage" src={source} alt="not found" />
        </Box>
      </Modal>
    </div>
  );
};

export default UserVehicleTable;
