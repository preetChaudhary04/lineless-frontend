import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useTickets } from "../hooks/useTickets";
import { useServices } from "../../services/hooks/useServices";
import { io } from "socket.io-client";
import "../style.css";

const MerchantLineManager = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { activeLineup, currentServingTicket, loader, error, handleFetchActiveLineup, handleAdvanceNext, setActiveLineup, setCurrentServingTicket, handleClearCounter } = useTickets();
  const { handleUpdateStatus, services } = useServices();

  const currentService = services.find(s => s.serviceId === serviceId);
  const [currentStatus, setCurrentStatus] = useState(currentService?.serviceStatus || "CLOSED");

  // Initial data load loop
  useEffect(() => {
    if (serviceId) {
      handleFetchActiveLineup(serviceId);
    }
  }, [serviceId]);

  // REAL-TIME WEBSOCKET PIPELINE CONNECTION
  useEffect(() => {
    if (!serviceId) return;

    const socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"]
    });

    socket.emit("join_service_room", serviceId);

    socket.on("queue_updated", (data) => {
      console.log("⚡ Real-time stream received event:", data);

      if (data.action === "TICKET_CREATED" || data.action === "TICKET_ADVANCED" || data.action === "QUEUE_EMPTY") {
        handleFetchActiveLineup(serviceId);
      }
    });

    return () => {
      socket.off("queue_updated");
      socket.disconnect();
      console.log("severed manager socket connection channel instance cleanly");
    };
  }, [serviceId]);

  useEffect(() => {
    if (currentService) {
      setCurrentStatus(currentService.serviceStatus);
    }
  }, [currentService]);

  const changeStatus = async (newStatus) => {
    try {
      await handleUpdateStatus(serviceId, newStatus);
      setCurrentStatus(newStatus);
    } catch (err) {
      console.error("Failed to alter desk status parameters:", err.message, err);
    }
  };

  const triggerNextCall = async () => {
    try {
      await handleAdvanceNext(serviceId);
    } catch (err) { }
  };

  // 🟨 Trigger method to gracefully clear the last student from the active slot
  const triggerClearDesk = async () => {
    try {
      await handleClearCounter(serviceId);
    } catch (err) { }
  };

  const waitingCustomers = activeLineup.filter(t => t.status === "WAITING");

  return (
    <div className="manager-wrapper">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="back-link-btn" onClick={() => navigate("/services")}>
          ⬅️ Return to Desks
        </button>

        <div className="status-toggle-bar" style={{ marginBottom: "25px" }}>
          <span style={{ marginRight: "10px", fontWeight: "600" }}>Counter Status:</span>
          <button
            className={`action-btn ${currentStatus === "OPEN" ? "success-btn" : "secondary-btn"}`}
            onClick={() => changeStatus("OPEN")}
            style={{ padding: "6px 14px", fontSize: "9pt", borderRadius: "4px 0 0 4px" }}
          >
            🟢 Open
          </button>
          <button
            className={`action-btn ${currentStatus === "CLOSED" ? "error-btn" : "secondary-btn"}`}
            onClick={() => changeStatus("CLOSED")}
            style={{ padding: "6px 14px", fontSize: "9pt", borderRadius: "0", backgroundColor: currentStatus === "CLOSED" ? "#e53e3e" : "", color: currentStatus === "CLOSED" ? "#fff" : "" }}
          >
            🔴 Close
          </button>
          <button
            className={`action-btn ${currentStatus === "PAUSED" ? "primary-btn" : "secondary-btn"}`}
            onClick={() => changeStatus("PAUSED")}
            style={{ padding: "6px 14px", fontSize: "9pt", borderRadius: "0 4px 4px 0", backgroundColor: currentStatus === "PAUSED" ? "#dd6b20" : "" }}
          >
            🟡 Pause
          </button>
        </div>
      </div>

      {error && <div className="alert error-alert">{error}</div>}

      <div className="serving-hero-section">
        <p className="hero-sub">
          CURRENTLY SERVING AT COUNTER
          <span className={`status-badge ${currentStatus.toLowerCase()}`} style={{ marginLeft: "10px" }}>{currentStatus}</span>
        </p>

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

        {/* 🟨 Evaluates the state machine tail to render a close switch option if the line is empty */}
        {currentServingTicket && waitingCustomers.length === 0 ? (
          <button
            className="action-btn next-step-btn"
            onClick={triggerClearDesk}
            disabled={loader}
            style={{ backgroundColor: "#4a5568" }}
          >
            {loader ? "Clearing..." : "🏁 Finish & Clear Counter"}
          </button>
        ) : (
          <button
            className="action-btn next-step-btn"
            onClick={triggerNextCall}
            disabled={loader || waitingCustomers.length === 0 || currentStatus !== "OPEN"}
          >
            {loader ? "Advancing State..." : currentStatus !== "OPEN" ? "🚫 Open Counter to Serve" : "🔊 Call Next Customer"}
          </button>
        )}
      </div>

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