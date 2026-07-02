import React, { useEffect } from "react";
import { useTickets } from "../hooks/useTickets";
import "../style.css";

const MyTicketsDashboard = () => {
  const { myTickets, loader, error, handleFetchMyTickets } = useTickets();

  useEffect(() => {
    handleFetchMyTickets();
  }, []);

  return (
    <div className="ticket-page-wrapper">
      <div className="ticket-page-header">
        <h1>Your Active Tokens</h1>
        <p>Monitor your position live without needing to stand in physical rows.</p>
      </div>

      {error && <div className="alert error-alert">{error}</div>}

      {loader && myTickets.length === 0 ? (
        <div className="ticket-message">Syncing token records...</div>
      ) : myTickets.length === 0 ? (
        <div className="ticket-message empty-state">
          You haven't requested any queue tokens yet. Visit the Services panel to join a line!
        </div>
      ) : (
        <div className="tokens-container-list">
          {myTickets.map((ticket) => (
            <div key={ticket.ticketId} className={`ticket-stub-card ${ticket.status.toLowerCase()}`}>
              <div className="stub-header">
                <span className="desk-tag">📍 {ticket.service?.name || "Campus Desk"}</span>
                <span className={`stub-badge ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
              </div>

              <div className="stub-body">
                <p className="num-label">Token Number</p>
                <h2>#{String(ticket.ticketNumber).padStart(3, "0")}</h2>
              </div>

              <div className="stub-footer">
                <p>Issued: {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                {ticket.status === "WAITING" && (
                  <p className="live-status-alert">🔔 Keep an eye on this space</p>
                )}
                {ticket.status === "SERVING" && (
                  <p className="live-status-alert urgent">⚡ Proceed to counter immediately!</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTicketsDashboard;