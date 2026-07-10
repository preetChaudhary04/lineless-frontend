import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";
import LogoutPopUp from "./LogoutPopUp";
import "./Navbar.css";

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // If the user isn't logged in, don't show the navigation bar at all
  if (!user) return null;

  return (
    <>
      <nav className="global-navbar">
        <div className="navbar-brand" onClick={() => navigate("/services")}>
          ⚡ <span className="brand-highlight">Line</span>Less
        </div>

        <ul className="navbar-links">
          <li>
            <Link to="/services" className="nav-item">🖥️ Service Desks</Link>
          </li>

          {/* 🟨 Links visible STRICTLY to Students/Customers */}
          {user.role === "CUSTOMER" && (
            <li>
              <Link to="/my-tickets" className="nav-item">🎟️ My Tokens</Link>
            </li>
          )}
        </ul>

        <div className="navbar-user-control">
          <span className="user-badge-profile">
            👤 {user.fullName} <span className="role-tag-sub">({user.role})</span>
          </span>
          <button
            className="nav-logout-btn"
            onClick={() => setShowLogoutPopup(true)}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Reusing your global logout pop-up modal panel */}
      <LogoutPopUp
        isOpen={showLogoutPopup}
        onConfirm={async () => {
          try {
            await handleLogout();
            navigate("/login");
          } catch (err) {
            console.error("Navigation logout failed:", err);
          } finally {
            setShowLogoutPopup(false);
          }
        }}
        onCancel={() => setShowLogoutPopup(false)}
      />
    </>
  );
};

export default Navbar;