import React from "react";
import "./Home.css";

function Home() {
  console.log(localStorage.getItem("token"));
  return (
    <div className="HomeContainer">
      <h1>Welcome!</h1>
      <div className="Home"></div>
    </div>
  );
}

export default Home;
