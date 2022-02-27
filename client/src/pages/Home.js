import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  console.log(localStorage.getItem("token"));
  return (
    <div className="Home">
      <h1>Welcome!</h1>
      <div className="buttons">
        <button type="button" onClick={() => navigate("/login")}>
          Login
        </button>
        <button type="button" onClick={() => navigate("/register")}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Home;
