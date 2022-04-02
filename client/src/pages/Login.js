import React from "react";
import { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:1590/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(data);
    let userData = data.user; //get jwt signed token from local storage
    console.log(data.user);
    let jwtData = userData.split(".")[1]; //get the payload of the token
    let decodedJsonJwt = window.atob(jwtData); //decrypt the payload
    let decodedData = JSON.parse(decodedJsonJwt); //parse it to json
    let role = decodedData.role; //and fetch the components you want

    if (data.user) {
      console.log(data);
      localStorage.setItem("token", data.user);
      alert("Login successful " + role);
      console.log("USER ROLE : " + role);
      if (role == "admin") {
        window.location.href = "/admin";
      } else window.location.href = "/dashboard";
    } else {
      console.log("does not exist");
      alert("Please check your username and password");
    }
  }

  return (
    <div className="LoginContainer">
      <div className="Login">
        <h1>Login</h1>
        <form onSubmit={loginUser}>
          <input
            className="inputField"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            title="THIS IS UR EMAIL"
          />
          <br />
          <input
            className="inputField"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <br />
          <input className="submitButton" type="submit" value="Login"></input>
        </form>
      </div>
    </div>
  );
}

export default Login;
