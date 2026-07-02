import React, { createContext, useState } from "react";

export const TicketsContext = createContext(null);

export const TicketsProvider = ({ children }) => {
  // Student State Layers
  const [myTickets, setMyTickets] = useState([]);

  // Provider / Admin State Layers
  const [activeLineup, setActiveLineup] = useState([]);
  const [currentServingTicket, setCurrentServingTicket] = useState(null);

  // Status flags
  const [ticketsLoader, setTicketsLoader] = useState(false);
  const [ticketsError, setTicketsError] = useState("");

  const value = {
    myTickets,
    setMyTickets,
    activeLineup,
    setActiveLineup,
    currentServingTicket,
    setCurrentServingTicket,
    ticketsLoader,
    setTicketsLoader,
    ticketsError,
    setTicketsError,
  };

  return (
    <TicketsContext.Provider value={value}>
      {children}
    </TicketsContext.Provider>
  );
};