import React from "react";
import Header from "./Navbar";
import UserVehicleTable from "../components/UserVehicleTable.jsx";

const UserVehiclePage = () => {
  return (
    <div>
      <Header />
      <UserVehicleTable></UserVehicleTable>
    </div>
  );
};

export default UserVehiclePage;
