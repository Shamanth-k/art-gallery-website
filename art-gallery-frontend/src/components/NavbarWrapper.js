// frontend/src/components/NavbarWrapper.js
import React from "react";
import { useLocation } from "react-router-dom";
import UserNavbar from "./userNavbar";
import AdminNavbar from "./adminNavbar";

const NavbarWrapper = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  if (location.pathname === "/login") {
    return null;
  }

  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  return (
    <div className={isHomePage ? "navbar-transparent" : "navbar-opaque"}>
      {user && user.role === "admin" ? <AdminNavbar /> : <UserNavbar />}
    </div>
  );
};

export default NavbarWrapper;
