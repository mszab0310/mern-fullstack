import { Container, Navbar, Nav } from "react-bootstrap";
import React from "react";

import "./Navbar.css";
import { NavLink } from "react-router-dom";
function Header() {
  return (
    <Navbar className="navbar" bg="dark" expand="lg" variant="dark">
      <Container className="navbar-container">
        <Navbar.Brand href="/">
          <img
            alt=""
            title="planning icons"
            height="60"
            className="d-inline-block align-top brand-logo"
          />
          {""}
          <h1 className="brand-text">Home</h1>
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse collapseOnSelect>
          <Nav
            className="me-auto nav-links justify-content-end"
            style={{ width: "100%" }}
          >
            <Nav.Link href="/vehicles" className="nav-link">
              Vehicles
            </Nav.Link>
            <Nav.Link href="/register" className="nav-link">
              Log Out
            </Nav.Link>

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
}

export default Header;
