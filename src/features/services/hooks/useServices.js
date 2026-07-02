import { useContext } from "react";
import { ServicesContext } from "../context/servicesContext";
import {
  fetchAllServices,
  createServiceCounter,
} from "../services/servicesApi";

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error("useServices must be used within a ServicesProvider");
  }

  const {
    services,
    setServices,
    servicesLoader,
    setServicesLoader,
    servicesError,
    setServicesError,
  } = context;

  // Get all services and updates state memory
  const handleFetchAllServices = async () => {
    setServicesLoader(true);
    setServicesError("");
    try {
      const data = await fetchAllServices();
      setServices(data.services || []);
    } catch (err) {
      console.error("Hook error in handleFetchAllServices:", err.message);
      setServicesError(
        err.message || "Could not synchronize service counters.",
      );
    } finally {
      setServicesLoader(false);
    }
  };

  // Creates a new service counter and appends it to the active array list
  const handleCreateService = async ({ name, description }) => {
    setServicesLoader(true);
    setServicesError("");
    try {
      const data = await createServiceCounter({ name, description });
      if (data && data.service) {
        setServices((prevServices) => [data.service, ...prevServices]);
      }
      return data;
    } catch (err) {
      console.error("Hook error in handleCreateService:", err.message);
      setServicesError(err.message || "Failed to provision new counter.");
      throw err;
    } finally {
      setServicesLoader(false);
    }
  };

  return {
    services,
    loader: servicesLoader,
    error: servicesError,
    handleFetchAllServices,
    handleCreateService,
  };
};
