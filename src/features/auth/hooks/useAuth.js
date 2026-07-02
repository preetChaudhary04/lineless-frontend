import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../services/authApi";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  const { user, setUser, loader, setLoader } = context;

  // Handle Registration
  const handleRegister = async ({
    fullName,
    email,
    password,
    phoneNumber,
    role,
  }) => {
    setLoader(true);
    try {
      const data = await registerUser({
        fullName,
        email,
        password,
        phoneNumber,
        role,
      });
      if (data) setUser(data.user);
    } catch (error) {
      console.error("Registration failed:", error.message);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  // Handle Login
  const handleLogin = async ({ email, password }) => {
    setLoader(true);
    try {
      const data = await loginUser({ email, password });
      if (data) setUser(data.user);
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    setLoader(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Hook error in handleLogout:", error.message);
    } finally {
      setLoader(false);
    }
  };

  // Handle Get Me (Manual refresh check if needed)
  const handleGetMe = async () => {
    setLoader(true);
    try {
      const data = await getMe();
      if (data) setUser(data.user);
    } catch (error) {
      console.error("Hook error in handleGetMe:", error.message);
      setUser(null);
    } finally {
      setLoader(false);
    }
  };

  // Automatic Session Restoration on Refresh
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await getMe();
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoader(false);
      }
    };

    restoreSession();
  }, [setUser, setLoader]);

  return {
    user,
    loader,
    handleRegister,
    handleLogin,
    handleLogout,
    handleGetMe,
  };
};
