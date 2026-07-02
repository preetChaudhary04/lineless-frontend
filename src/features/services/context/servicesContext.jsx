import React, { createContext, useState } from "react";

export const ServicesContext = createContext(null);

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [servicesLoader, setServicesLoader] = useState(false);
  const [servicesError, setServicesError] = useState("");

  const value = {
    services,
    setServices,
    servicesLoader,
    setServicesLoader,
    servicesError,
    setServicesError,
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
};