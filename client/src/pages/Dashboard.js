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
        <br />
        <h1> Your phone number: {phoneNumber || "No phone number found"} </h1>
        <form onSubmit={updatePhoneNumber}>
          <input
            type="tel"
            pattern="[+]{1}[0-9]{11,14}"
            placeholder="Phone Number"
            value={tempPhoneNumber}
            onChange={(e) => setTempPhoneNumber(e.target.value)}
          />
          <br />
          <input type="submit" value="Update phone number" />
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
