import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MechanicVehicles from "./pages/MechanicVehicles";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoutes from "./ProtectedRoutes";
import UserVehiclePage from "./pages/UserVehiclePage";
import UserVehicle from "./pages/UserVehicle";
import Vehicle from "./pages/Vehicle";
import UserAppointment from "./pages/UserAppointments";
import AdminAppointment from "./pages/AdminAppointments";
import MechanicAppointment from "./pages/MechanicAppointments";
import Account from "./pages/Account";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/vehicles" exact element={<UserVehiclePage />} />
            <Route path="/vehicle" exact element={<Vehicle />} />
            <Route path="/user/vehicle" exact element={<UserVehicle />} />
            <Route path="/dashboard" exact element={<Dashboard />} />
            <Route
              path="/userAppointments"
              exact
              element={<UserAppointment />}
            />
            <Route
              path="/adminAppointments"
              exact
              element={<AdminAppointment />}
            />
            <Route
              path="/mechanicAppointments"
              exact
              element={<MechanicAppointment />}
            />
            <Route path="/account" exact element={<Account />} />

            <Route path="/admin" exact element={<Admin />} />
            <Route path="/all-vehicles" exact element={<MechanicVehicles />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
