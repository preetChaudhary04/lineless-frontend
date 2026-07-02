import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router";
import "../style.css";

const Register = () => {
  const { handleRegister, loader } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "CUSTOMER",
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
      await handleRegister(formData);
      setUiSuccess("Registration successful! Welcome to LineLess.");
      navigate("/services");
    } catch (err) {
      setUiError(err.message || "An unexpected registration error occurred.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join LineLess</h2>
        <p className="auth-subtitle">Create an account to join and manage virtual lines</p>

        {uiError && <div className="alert error-alert">{uiError}</div>}
        {uiSuccess && <div className="alert success-alert">{uiSuccess}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number (Optional)</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1234567890"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="auth-select"
            >
              <option value="CUSTOMER">Student / Customer</option>
              <option value="PROVIDER">Merchant / Service Provider</option>
            </select>
          </div>

          <button type="submit" className="auth-btn" disabled={loader}>
            {loader ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="auth-redirect-text">
          Already have an account? <Link to='/login'>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;