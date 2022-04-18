import MaterialTable from "material-table";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import tableIcons from "../components/MaterialTableIcons";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { InputLabel, MenuItem, Select } from "@material-ui/core";

const UserVehicleTable = () => {
  const [vehicleList, setVehicleList] = useState([]);
  const [open, setOpen] = useState(false);

  const columns = [
    { title: "Chassis Number", field: "chassis_number" },
    { title: "Brand", field: "brand" },
    { title: "Model", field: "model" },
    { title: "Body Type", field: "bodyType" },
    { title: "Color", field: "color" },
    { title: "Fabrication year", field: "year", type: "numeric" },
  ];

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

  return (
    <div>
      <Button onClick={handleGetButton}>Refresh</Button>
      <MaterialTable
        title="Your Vehicles"
        columns={columns}
        icons={tableIcons}
        data={vehicleList}
      />
    </div>
  );
};

export default UserVehicleTable;
