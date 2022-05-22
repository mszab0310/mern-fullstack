import React from "react";
import Header from "./Navbar";
import UserVehicleTable from "../components/UserVehicleTable.jsx";
import AddVehicleModal from "../components/AddVehcileModal";

const UserVehiclePage = () => {
  return (
    <div>
      <Header />
      <UserVehicleTable></UserVehicleTable>
      <AddVehicleModal></AddVehicleModal>
    </div>
  );
};

export default UserVehiclePage;
