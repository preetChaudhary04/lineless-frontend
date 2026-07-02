import React, { useEffect, useState } from "react";
import { useServices } from "../hooks/useServices";
import { useAuth } from "../../auth/hooks/useAuth"; // To get user
import LogoutPopUp from '../../../components/LogoutPopUp';
import { useNavigate } from "react-router";
import "../style.css";

const ServicesDashboard = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const { services, loader, error, handleFetchAllServices, handleCreateService } = useServices();

  // Local state for the creation modal/form toggle (For Providers)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");

  // Local state for managing the visibility of the confirmation popup
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Sync data from Express on component mount
  useEffect(() => {
    handleFetchAllServices();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      await handleCreateService(formData);
      setFormData({ name: "", description: "" });
      setShowCreateForm(false);
    } catch (err) {
      setFormError(err.message || "Failed to create counter.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header Management Strip */}
      <div className="dashboard-header">
        <div className="header-main-info">
          <h1>Campus Service Desks</h1>
          <p>Select a counter to monitor wait times or register for a virtual spot.</p>
        </div>

        {/* Action Button Cluster Container */}
        <div className="header-actions-cluster">
          {/* Logout Control - Intercepted to open confirmation popup */}
          <button
            className="action-btn secondary-btn"
            onClick={() => setShowLogoutPopup(true)}
          >
            Logout
          </button>

          {/* Dynamic Action Button: Only appears if the logged-in user is a Provider/Admin */}
          {(user?.role === "PROVIDER" || user?.role === "ADMIN") && (
            <button
              className="action-btn primary-btn"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "Cancel Assignment" : "Create New Desk"}
            </button>
          )}
        </div>
      </div>

      {/* Global Hook Network Error Alert */}
      {error && <div className="alert error-alert">{error}</div>}

      {/* Conditional Row Block: Provider Creation Form */}
      {showCreateForm && (
        <div className="creation-card-wrapper">
          <form onSubmit={handleFormSubmit} className="inline-creation-form">
            <h3>Configure New Campus Counter</h3>
            {formError && <div className="alert error-alert">{formError}</div>}

            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Counter Name (e.g., Main Canteen, Xerox Room)"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Short Description (e.g., Token collection, billing queries)"
                value={formData.description}
                onChange={handleInputChange}
              />
              <button type="submit" className="action-btn success-btn" disabled={loader}>
                {loader ? "Provisioning..." : "Confirm Launch"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Core Component Grid Interface */}
      {loader && services.length === 0 ? (
        <div className="dashboard-message">Loading active campus counters...</div>
      ) : services.length === 0 ? (
        <div className="dashboard-message empty-state">
          No service desks are currently registered. Check back later!
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.serviceId} className="service-item-card">
              <div className="card-top">
                <span className={`status-badge ${service.serviceStatus.toLowerCase()}`}>
                  {service.serviceStatus}
                </span>
                <span className="timestamp-id">
                  ID: {service.serviceId.substring(0, 8)}...
                </span>
              </div>

              <h3>{service.name}</h3>
              <p className="card-description">
                {service.description || "No context description added for this counter."}
              </p>

              <div className="card-footer">
                <div className="provider-stamp">
                  <span className="icon">👤</span>
                  <div>
                    <p className="p-name">{service.provider?.fullName || "Staff Node"}</p>
                    <p className="p-email">{service.provider?.email || "campus@edu"}</p>
                  </div>
                </div>

                <button className="join-queue-btn">
                  {user?.role === "PROVIDER" ? "Monitor Line" : "Get Ticket"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logout Confirmation Dialog Component */}
      <LogoutPopUp
        isOpen={showLogoutPopup}
        onConfirm={() => {
          handleLogout();
          navigate('/login');
        }}
        onCancel={() => {
          setShowLogoutPopup(false);
        }}
      />
    </div>
  );
};

export default ServicesDashboard;