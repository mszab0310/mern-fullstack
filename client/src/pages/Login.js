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

    if (data.user) {
      console.log(data);
      localStorage.setItem("token", data.user);
      alert("Login successful");
      window.location.href = "/dashboard";
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
