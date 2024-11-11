import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-950 p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <NavLink to="/" className="text-xl font-semibold text-slate-300">
            VRWA
        </NavLink>

        <div className="flex items-center space-x-4">
          <NavLink
            to="/sqli"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-slate-300"
                : "text-slate-400 hover:text-slate-300"
            }
          >
            SQLi
          </NavLink>
          <NavLink
            to="/csrf"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-slate-300"
                : "text-slate-400 hover:text-slate-300"
            }
          >
            CSRF
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
