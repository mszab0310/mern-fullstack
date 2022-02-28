import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  console.log(localStorage.getItem("token"));
  return (
    <div className="HomeContainer">
      <h1>Welcome!</h1>
      <div className="Home"></div>
    </div>
  );
}

export default Home;
