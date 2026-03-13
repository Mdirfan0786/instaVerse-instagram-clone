import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const Login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const Logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};
