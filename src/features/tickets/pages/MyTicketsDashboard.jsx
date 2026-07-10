import React, { useEffect } from "react";
import { useTickets } from "../hooks/useTickets";
import { io } from "socket.io-client";
import "../style.css";

const MyTicketsDashboard = () => {
  const { myTickets, loader, error, handleFetchMyTickets } = useTickets();

  useEffect(() => {
    handleFetchMyTickets();
  }, []);

  // 🟨 REAL-TIME STUDENT UPDATES PIPELINE
  useEffect(() => {
    // Collect all unique service IDs from the student's active waiting tickets
    const activeServiceIds = myTickets
      .filter(ticket => ticket.status === "WAITING" || ticket.status === "SERVING")
      .map(ticket => ticket.serviceId);

    if (activeServiceIds.length === 0) return;

    // 1. Establish direct connection stream to the Express gateway
    const socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"]
    });

    // 2. Join the dedicated room channel for EACH active ticket service counter
    activeServiceIds.forEach(serviceId => {
      socket.emit("join_service_room", serviceId);
      console.log(`🚪 Student listening to room: service_${serviceId}`);
    });

    // 3. Listen for line advancements or completions broadcast by the server
    socket.on("queue_updated", (data) => {
      console.log("⚡ Student terminal received real-time event:", data);

      if (data.action === "TICKET_ADVANCED" || data.action === "QUEUE_EMPTY") {
        // 🟨 Silently pull down fresh ticket snapshots to update status badges instantly
        handleFetchMyTickets();
      }
    });

    // 4. Clean up connection scopes upon page navigation or state reset
    return () => {
      socket.off("queue_updated");
      socket.disconnect();
      console.log("🔌 Severed student synchronization channels cleanly");
    };
  }, [myTickets]);

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

              {/* <div className="stub-footer">
                <p>Issued: {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                {ticket.status === "WAITING" && (
                  <p className="live-status-alert">🔔 Keep an eye on this space</p>
                )}
                {ticket.status === "SERVING" && (
                  <p className="live-status-alert urgent">⚡ Proceed to counter immediately!</p>
                )}
              </div> */}
              <div className="stub-footer">
                <p>Issued: {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

                {ticket.status === "WAITING" && (
                  <>
                    {/* 🟨 Displays real-time position calculations dynamically */}
                    <p className="live-status-alert">
                      {ticket.peopleAhead === 0 ? (
                        "⚡ You are next in line! Move close to the desk."
                      ) : (
                        `👥 People ahead of you: ${ticket.peopleAhead}`
                      )}
                    </p>
                    <p style={{ fontSize: "8.5pt", color: "#a0aec0" }}>
                      Est. wait time: ~{ticket.peopleAhead * 5} mins
                    </p>
                  </>
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