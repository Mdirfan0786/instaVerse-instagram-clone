import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { clientServer } from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const Login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const Logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      clientServer
        .get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};
