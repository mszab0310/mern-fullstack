import React from "react";
import { Navigate } from "react-router-dom";

const Admin = () => {
  async function getAdmin() {
    let userData = localStorage.getItem("token");
    let jwtData = userData.split(".")[1];
    let decodedJsonJwt = window.atob(jwtData);
    let decodedData = JSON.parse(decodedJsonJwt);
    let role = decodedData.role;
    const response = await fetch("http://localhost:1590/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
      }),
    });
    const data = await response.json();
    if (!data) {
      alert("ACCES DENIED");
      Navigate("/dashboard", { replace: true });
    } else {
      alert(data);
    }
    console.log(data);
  }

  async function admin(event) {
    event.preventDefault();
    console.log("BUtton");
    getAdmin();
    console.log("returns");
  }
  return (
    <div>
      <form onSubmit={admin}>
        <input type="submit" value="ADMIN" />
      </form>
    </div>
  );
};

export default Admin;
