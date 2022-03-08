import React from "react";
import { Navigate } from "react-router-dom";

const Admin = () => {
  async function getAdmin() {
    const req = await fetch("http://localhost:1590/api/admin", {
      headers: {
        "x-acces-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      console.log(data.role);
    } else {
      alert(data.error);
      Navigate("/dashboard", { replace: true });
    }
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
