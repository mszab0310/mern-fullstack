import MaterialTable from "material-table";
import React from "react";
import { useState } from "react";
import tableIcons from "../components/MaterialTableIcons";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./VehicleTableUser.css";

const UserVehicleTable = () => {
  const [vehicleList, setVehicleList] = useState([]);
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState(null);

  const columns = [
    { title: "Chassis Number", field: "chassis_number" },
    { title: "Brand", field: "brand" },
    { title: "Model", field: "model" },
    { title: "Body Type", field: "bodyType" },
    { title: "Color", field: "color" },
    { title: "Fabrication year", field: "year", type: "numeric" },
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

  const handleGetButton = () => {
    getVehicles();
  };

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

  const handleClose = () => {
    setOpen(false);
    setSource("");
  };

  return (
    <div>
      <Button onClick={handleGetButton}>Refresh</Button>
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
        ]}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img className="vehicleImage" src={source} alt="Image of vehicle" />
        </Box>
      </Modal>
    </div>
  );
};

export default UserVehicleTable;
