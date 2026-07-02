import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTickets } from "../hooks/useTickets";
import "../style.css";

const MerchantLineManager = () => {
  const { serviceId } = useParams(); // Capture which desk we are managing from URL parameters
  const navigate = useNavigate();
  const {
    activeLineup,
    currentServingTicket,
    loader,
    error,
    handleFetchActiveLineup,
    handleAdvanceNext
  } = useTickets();

  useEffect(() => {
    if (serviceId) {
      handleFetchActiveLineup(serviceId);
    }
  }, [serviceId]);

  const triggerNextCall = async () => {
    try {
      await handleAdvanceNext(serviceId);
    } catch (err) {
      // Handled gracefully inside state
    }
  };

  // Separate remaining pipeline count
  const waitingCustomers = activeLineup.filter(t => t.status === "WAITING");

  return (
    <div className="manager-wrapper">
      <button className="back-link-btn" onClick={() => navigate("/services")}>
        ⬅️ Return to Desks
      </button>

      {error && <div className="alert error-alert">{error}</div>}

      {/* Hero Display Panel: Who is up right now */}
      <div className="serving-hero-section">
        <p className="hero-sub">CURRENTLY SERVING AT COUNTER</p>
        {currentServingTicket ? (
          <div className="active-glow-box">
            <h1>Ticket #{String(currentServingTicket.ticketNumber).padStart(3, "0")}</h1>
            <h3>👤 {currentServingTicket.student?.fullName || "Student Client"}</h3>
            <p>{currentServingTicket.student?.email}</p>
          </div>
        ) : (
          <div className="active-glow-box empty">
            <h1>No Active Ticket</h1>
            <p>The desk is currently clear or on standby.</p>
          </div>
        )}

        <button
          className="action-btn next-step-btn"
          onClick={triggerNextCall}
          disabled={loader || waitingCustomers.length === 0}
        >
          {loader ? "Advancing State..." : "🔊 Call Next Customer"}
        </button>
      </div>

      {/* Split Queue Line Display List */}
      <div className="lineup-list-section">
        <h3>Waiting Queue Lineup ({waitingCustomers.length} students pending)</h3>

        {waitingCustomers.length === 0 ? (
          <div className="clean-empty-notice">No remaining tickets are waiting in this line loop.</div>
        ) : (
          <table className="lineup-table-grid">
            <thead>
              <tr>
                <th>Order</th>
                <th>Token</th>
                <th>Student Candidate</th>
                <th>Registered Spot Time</th>
              </tr>
            </thead>
            <tbody>
              {waitingCustomers.map((ticket, index) => (
                <tr key={ticket.ticketId}>
                  <td><strong>{index + 1}</strong></td>
                  <td><span className="table-token-badge">#{ticket.ticketNumber}</span></td>
                  <td>{ticket.student?.fullName || "Authenticated Student"}</td>
                  <td>{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MerchantLineManager;