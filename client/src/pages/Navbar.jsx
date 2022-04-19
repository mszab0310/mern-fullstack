import { Container, Navbar, Nav } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Header = () => {
  const [admin, setAdmin] = useState("");
  const [loggedIn, setLoggedIn] = useState("");

  const navigate = useNavigate();
  async function checkAdmin() {
    const req = await fetch("http://localhost:1590/api/admin", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok" && data.role === "admin") {
      setAdmin(true);
    } else setAdmin(false);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      setLoggedIn(true);
      if (!user) {
        setLoggedIn(false);
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        checkAdmin();
      }
    } else {
      localStorage.removeItem("token");
      setLoggedIn(false);
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <Navbar className="navbar" bg="dark" expand="lg" variant="dark">
      <Container className="navbar-container">
        {!loggedIn && (
          <Navbar.Brand href="/">
            <img
              alt=""
              // src="https://cdn-icons.flaticon.com/png/512/1240/premium/1240942.png?token=exp=1646061053~hmac=28f2fa23587ce01fddd6d3d6b7061805"
              title="planning icons"
              height="60"
              className="d-inline-block align-top brand-logo"
            />
            {""}
            <h1 className="brand-text">Home</h1>
          </Navbar.Brand>
        )}

        {loggedIn && (
          <Navbar.Brand href="/dashboard">
            <img
              alt=""
              // src="https://cdn-icons.flaticon.com/png/512/1240/premium/1240942.png?token=exp=1646061053~hmac=28f2fa23587ce01fddd6d3d6b7061805"
              title="planning icons"
              height="60"
              className="d-inline-block align-top brand-logo"
            />
            {""}
            <h1 className="brand-text">Home</h1>
          </Navbar.Brand>
        )}

        <Navbar.Toggle />
        <Navbar.Collapse collapseOnSelect>
          <Nav
            className="me-auto nav-links justify-content-end"
            style={{ width: "100%" }}
          >
            {!loggedIn && (
              <Nav.Link href="/register" className="nav-link">
                Register
              </Nav.Link>
            )}
            {!loggedIn && (
              <Nav.Link href="/login" className="nav-link">
                Log in
              </Nav.Link>
            )}

            {loggedIn && (
              <Nav.Link href="/vehicles" className="nav-link">
                Vehicles
              </Nav.Link>
            )}

            {loggedIn && (
              <Nav.Link
                href="/"
                className="nav-link"
                onClick={() => {
                  localStorage.removeItem("token");
                  setLoggedIn(false);
                }}
              >
                Log Out
              </Nav.Link>
            )}

            {admin && (
              <Nav.Link href="/admin" className="nav-link">
                Admin
              </Nav.Link>
            )}
            <Nav.Link
              href="https://www.youtube.com/watch?v=ClU3fctbGls"
              className="nav-link"
            >
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;
