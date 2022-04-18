import React from "react";
import Header from "./LoggedInNavbar";
import UserVehicleTable from "../components/VehicleTableUser";

const UserVehiclePage = () => {
  return (
    <div>
      <Header />
      <UserVehicleTable></UserVehicleTable>
    </div>
  );
};

export default UserVehiclePage;
