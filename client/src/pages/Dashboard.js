import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./Navbar";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");
  const [admin, setAdmin] = useState("");
  const [user, setUser] = useState("");

  async function checkAdmin() {
    const req = await fetch("http://localhost:1590/api/admin", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok" && data.role === "admin") {
      setAdmin(true);
    } else setAdmin(false);
  }

  async function getUserDetails() {
    const req = await fetch("http://localhost:1590/api/account/details", {
      headers: {
        "user-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();

    if (data.status === "ok") {
      setUser(data.user);
    } else {
      setUser("Service down");
    }
  }

  async function populatePhoneNumber() {
    const req = await fetch("http://localhost:1590/api/phoneNumber", {
      headers: {
        "x-acces-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      setPhoneNumber(data.phoneNumber);
    } else {
      alert(data.error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        populatePhoneNumber();
        checkAdmin();
        getUserDetails();
      }
    } else {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  });

  async function updatePhoneNumber(event) {
    event.preventDefault();
    const req = await fetch("http://localhost:1590/api/phoneNumber", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-acces-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        phoneNumber: tempPhoneNumber,
      }),
    });
    const data = await req.json();
    if (data.status === "ok") {
      setPhoneNumber(tempPhoneNumber);
      setTempPhoneNumber("");
    } else {
      alert(data.error);
    }
  }

  return (
    <div>
      <Header />
      <div className="Dashboard">
        <h1>Welcome back, {user.name} !</h1>
        <div className="welcome">
          Here at our service you can find everything you need to care for your
          vehicle. <br /> Feel free to explore our platform, add vehicles to
          your account or inspect the reapir history of the already added ones.
          <br />
          Make an appointment if you wish to trough our online appointments
          system that you can find in the Services Tab.
        </div>
        <h1>WE CARE FOR YOUR VEHICLE</h1>
        <img src={require("../images/team.jpg")} />
      </div>
    </div>
  );
};

export default Dashboard;
