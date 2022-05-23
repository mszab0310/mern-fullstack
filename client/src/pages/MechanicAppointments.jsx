import React, { useState, useEffect } from "react";
import Header from "./Navbar";
import "./MechanicAppointments.css";
import { Button } from "react-bootstrap";
import MaterialTable from "material-table";
import tableIcons from "../components/MaterialTableIcons";

function MechanicAppointment() {
  const [about, setAbout] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { title: "Type", field: "type" },
    { title: "Date", field: "date" },
    { title: "Hour", field: "hour" },
    { title: "Vehicle chassis number", field: "vehicle_vin" },
  ];

  async function getDetails() {
    const res = await fetch("http://localhost:1590/api/details", {
      method: "GET",
    });
    const data = await res.json();
    if (data.status === "ok") {
      let information = data.details;
      let abt = information.about;
      setAbout(abt);
      let serv = information.services;
      setServices(serv);
      let cont = information.contact;
      setContact(cont);
    } else {
      alert("Problem found");
    }
  }

  async function getAppointments() {
    const res = await fetch(
      "http://localhost:1590/api/privileged/appointments",
      {
        method: "GET",
        headers: {
          "privileged-access-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await res.json();
    if (data.status === "ok") {
      let appts = data.appointments;
      setAppointments(appts);
    } else {
      alert(data.error);
    }
  }

  const showAppointments = () => {
    getAppointments();
    setShowTable(true);
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <div>
      <Header />
      <div className="mechAppPage">
        <div className="textBox">
          <h1>About us</h1>
          <h4>{about}</h4>
          <h1>Our services</h1>
          <h4>{services}</h4>
          <h1>Contact details</h1>
          <h4>{contact}</h4>
        </div>
        <Button onClick={showAppointments} className="appointmentButton">
          Show appointments
        </Button>

        {showTable && (
          <MaterialTable
            title="Your Appointments"
            columns={columns}
            icons={tableIcons}
            data={appointments}
          />
        )}
      </div>
    </div>
  );
}

export default MechanicAppointment;
