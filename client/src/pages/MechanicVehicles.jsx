import React from "react";
import MechanicVehicleTable from "../components/AllVehiclesTable";
import Header from "./Navbar";

const MechanicVehicles = () => {
  return (
    <div>
      <Header />
      <MechanicVehicleTable></MechanicVehicleTable>
    </div>
  );
};
export default MechanicVehicles;
