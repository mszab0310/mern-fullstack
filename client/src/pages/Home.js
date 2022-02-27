import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  console.log(localStorage.getItem("token"));
  return (
    <div>
      <h1>Welcome!</h1>
      <button type="button" onClick={() => navigate("/login")}>
        Login
      </button>
      <button type="button" onClick={() => navigate("/register")}>
        Sign Up
      </button>
    </div>
  );
}

export default Home;
