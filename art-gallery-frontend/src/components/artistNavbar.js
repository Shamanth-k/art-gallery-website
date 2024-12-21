import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const artistNavbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">arti.</div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/gallery">Gallery</Link>
        </li>
        <li>
          <Link to="/artists">Artists</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/login">login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default artistNavbar;
