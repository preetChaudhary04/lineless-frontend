import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";
import Navbar from "./Navbar";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loader } = useAuth();

  // 🟨 Prevent flashing route updates while verifying user cookie states
  if (loader) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Verifying permissions...</div>;
  }

  // 🟨 Kick unauthenticated requests back to the authentication portal
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🟨 Intercept unauthorized role escalations gracefully
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/services" replace />;
  }

  return (
    <>
      <Navbar /> {/* 🟨 Renders the Navbar globally for all nested routes */}
      <main className="app-container" style={{ padding: "20px" }}>
        <Outlet /> {/* 🟨 Sub-nested child views render dynamically here */}
      </main>
    </>
  );
};

export default ProtectedRoute;