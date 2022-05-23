import React from "react";
import MechanicVehicleTable from "../components/MechanicVehicleTable";
import Header from "./Navbar";
import "./MechanicVehicles.css"

const MechanicVehicles = () => {
  return (
    <div>
      <Header />
      <div className="mechVeh">
        <MechanicVehicleTable></MechanicVehicleTable>
      </div>
    </div>
  );
};
export default MechanicVehicles;
