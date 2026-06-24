import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);

  return (
    <AuthContext.Provider value={{ user, setUser, loader, setLoader }}>
      {children}
    </AuthContext.Provider>
  );
};