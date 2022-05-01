import React from "react";
import "./Home.css";
import Header from "./Navbar";

function Home() {
  console.log(localStorage.getItem("token"));

  return (
    <div>
      <Header />
      <div className="HomeContainer">
        <div className="Home"></div>
      </div>
    </div>
  );
}

export default Home;
