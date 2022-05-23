import React from "react";
import Header from "./Navbar";
import UserVehicleTable from "../components/UserVehicleTable.jsx";
import AddVehicleModal from "../components/AddVehcileModal";
import "./UserVehiclePage.css";

const UserVehiclePage = () => {
  return (
    <div>
      <Header />
      <div className="vehPage">
        <UserVehicleTable></UserVehicleTable>
        <AddVehicleModal></AddVehicleModal>
      </div>
    </div>
  );
};

export default UserVehiclePage;
