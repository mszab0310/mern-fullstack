import { Container, Navbar, Nav } from "react-bootstrap";
import React from "react";

import "./Navbar.css";
function Header() {
  return (
    <Navbar className="navbar" bg="dark" expand="lg" variant="dark">
      <Container className="navbar-container">
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

        <Navbar.Toggle />
        <Navbar.Collapse collapseOnSelect>
          <Nav
            className="me-auto nav-links justify-content-end"
            style={{ width: "100%" }}
          >
            <Nav.Link href="/register" className="nav-link">
              Register
            </Nav.Link>
            <Nav.Link href="/login" className="nav-link">
              Log in
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
