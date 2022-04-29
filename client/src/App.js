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
import Vehicle from "./pages/Vehicle";

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
            <Route path="/dashboard" exact element={<Dashboard />} />
            <Route path="/admin" exact element={<Admin />} />
            <Route path="/all-vehicles" exact element={<MechanicVehicles />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
