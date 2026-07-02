import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router";
import "../style.css";

const Login = () => {
  const { handleLogin, loader } = useAuth();
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [uiError, setUiError] = useState("");
  const [uiSuccess, setUiSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiError("");
    setUiSuccess("");

    try {
      await handleLogin(formData);
      setUiSuccess("Welcome back! Login successful.");
      navigate("/");
    } catch (err) {
      setUiError(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to access your active virtual lines</p>

        {uiError && <div className="alert error-alert">{uiError}</div>}
        {uiSuccess && <div className="alert success-alert">{uiSuccess}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@college.edu"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loader}>
            {loader ? "Logging you in..." : "Login"}
          </button>
        </form>

        <p className="auth-redirect-text">
          Don't have an account yet? <Link to='/register'>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;