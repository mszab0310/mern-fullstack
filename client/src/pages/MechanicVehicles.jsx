import React from "react";
import MechanicVehicleTable from "../components/AllVehiclesTable";
import Header from "./Navbar";

const MechanicVehicles = () => {
  return (
    <div>
      <Header />
      <div> The Mechanic vehicles page</div>
      <MechanicVehicleTable></MechanicVehicleTable>
    </div>
  );
};
export default MechanicVehicles;
