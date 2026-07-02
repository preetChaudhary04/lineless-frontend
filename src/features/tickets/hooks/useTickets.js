import { useContext } from "react";
import { TicketsContext } from "../context/ticketContext";
import {
  joinQueue,
  fetchMyTickets,
  advanceNextCustomer,
  fetchActiveLineup,
} from "../services/ticketApi";

export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketsProvider");
  }

  const {
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
  } = context;

  // Handles joining a queue (Students only)
  const handleJoinQueue = async (serviceId) => {
    setTicketsLoader(true);
    setTicketsError("");
    try {
      const data = await joinQueue(serviceId);
      if (data && data.ticket) {
        setMyTickets((prev) => [data.ticket, ...prev]);
      }
      return data;
    } catch (err) {
      console.error("Hook error in handleJoinQueue:", err.message);
      setTicketsError(err.message || "Could not process registration.");
      throw err;
    } finally {
      setTicketsLoader(false);
    }
  };

  // Fetches a student's personal queue history/active tokens (Students only)
  const handleFetchMyTickets = async () => {
    setTicketsLoader(true);
    setTicketsError("");
    try {
      const data = await fetchMyTickets();
      setMyTickets(data.tickets || []);
    } catch (err) {
      console.error("Hook error in handleFetchMyTickets:", err.message);
      setTicketsError(err.message || "Could not retrieve ticket logs.");
    } finally {
      setTicketsLoader(false);
    }
  };

  // Provider calls up the next customer in line sequence
  const handleAdvanceNext = async (serviceId) => {
    setTicketsLoader(true);
    setTicketsError("");
    try {
      const data = await advanceNextCustomer(serviceId);
      setCurrentServingTicket(data.currentTicket);
      await handleFetchActiveLineup(serviceId); // Refresh the array lineup layout locally to reflect completion
      return data;
    } catch (err) {
      console.error("Hook error in handleAdvanceNext:", err.message);
      setTicketsError(err.message || "Failed to progress line.");
      throw err;
    } finally {
      setTicketsLoader(false);
    }
  };

  // Get the entire current active queue sequence of students
  const handleFetchActiveLineup = async (serviceId) => {
    setTicketsLoader(true);
    setTicketsError("");
    try {
      const data = await fetchActiveLineup(serviceId);
      const line = data.lineup || [];
      setActiveLineup(line);
      const serving = line.find((t) => t.status === "SERVING") || null;
      setCurrentServingTicket(serving);
    } catch (err) {
      console.error("Hook error in handleFetchActiveLineup:", err.message);
      setTicketsError(err.message || "Could not populate line array.");
    } finally {
      setTicketsLoader(false);
    }
  };

  return {
    myTickets,
    activeLineup,
    currentServingTicket,
    loader: ticketsLoader,
    error: ticketsError,
    handleJoinQueue,
    handleFetchMyTickets,
    handleFetchActiveLineup,
    handleAdvanceNext,
  };
};
