import { NavLink } from "react-router-dom";
import React from "react";

export const NavigationBar: React.FC = () => {
  return (
    <nav className="nav">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "link active" : "link")}
      >
        Home
      </NavLink>
      <NavLink
        to="/artworks"
        className={({ isActive }) => (isActive ? "link active" : "link")}
      >
        Artworks
      </NavLink>
      <NavLink
        to="/exhibitions"
        className={({ isActive }) => (isActive ? "link active" : "link")}
      >
        Exhibitions
      </NavLink>
    </nav>
  );
};
