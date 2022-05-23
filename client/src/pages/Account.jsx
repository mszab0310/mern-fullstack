import React from "react";
import "./Account.css";
import Header from "./Navbar";
import { useState, useEffect } from "react";

function Account() {
  const [user, setUser] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");
  const [changePhoneNumber, setChangePhoneNumber] = useState(false);

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

  useEffect(() => {
    getUserDetails();
  }, []);

  const changeNumber = () => {
    setChangePhoneNumber(true);
  };

  return (
    <div>
      <Header />
      <div className="accPage">
        <div className="userCard">
          <div className="userCardHeader">
            <img src={require("../images/no-avatar.png")} className="avatar" />
            <div className="headerContent">
              <h1 className="username">{user.name}</h1>
              <h3>{user.role}</h3>
            </div>
          </div>
          <div className="userCardContent">
            <div className="icons">
              <img
                src={require("../images/telephone-of-old-design.png")}
                className="icon"
              />
              <div className="contactDetails">
                {user.phoneNumber || "No phone number added"}
              </div>
            </div>
            <div className="icons">
              <img src={require("../images/at.png")} className="icon" />
              <div className="contactDetails">{user.email}</div>
            </div>
            <br />
          </div>
          {!changePhoneNumber && (
            <input
              className="updateBtn"
              type="submit"
              value="Update phone number"
              onClick={changeNumber}
            />
          )}
          {changePhoneNumber && (
            <form onSubmit={updatePhoneNumber} className="updateBtn">
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;
