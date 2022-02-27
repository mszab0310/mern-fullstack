import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");

  async function populateQuote() {
    const req = await fetch("http://localhost:1590/api/quote", {
      headers: {
        "x-acces-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      setQuote(data.quote);
    } else {
      alert(data.error);
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
        populateQuote();
        populatePhoneNumber();
      }
    }
  }, []);

  async function updateQuote(event) {
    event.preventDefault();
    const req = await fetch("http://localhost:1590/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-acces-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: tempQuote,
      }),
    });
    const data = await req.json();
    if (data.status === "ok") {
      setQuote(tempQuote);
      setTempQuote("");
    } else {
      alert(data.error);
    }
  }

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
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/", { replace: true });
        }}
        type="button"
      >
        Log Out
      </button>
      <h1> Your quote: {quote || "No Quote found"} </h1>
      <form onSubmit={updateQuote}>
        <input
          type="text"
          placeholder="Quote"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
        />
        <br />
        <input type="submit" value="Update quote" />
      </form>
      <br />
      <h1> Your phone number: {phoneNumber || "No phone number found"} </h1>
      <form onSubmit={updatePhoneNumber}>
        <input
          type="text"
          placeholder="Phone Number"
          value={tempPhoneNumber}
          onChange={(e) => setTempPhoneNumber(e.target.value)}
        />
        <br />
        <input type="submit" value="Update phone number" />
      </form>
    </div>
  );
};

export default Dashboard;
