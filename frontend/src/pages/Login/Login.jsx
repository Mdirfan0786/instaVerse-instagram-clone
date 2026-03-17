import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import AuthLayout from "../../components/auth/authLayout";
import InputField from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import GoogleButton from "../../components/ui/GoogleButton/GoogleButton";
import { Divider } from "@mui/material";
import { clientServer } from "../../api/axios";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { Login, user } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // checking Already Login
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  // Handling Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!identifier || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await clientServer.post("/auth/login", {
        identifier: identifier,
        password: password,
      });

      Login(res.data.user, res.data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout title="Login to Instaverse">
      <InputField
        value={identifier}
        onChange={(e) => {
          setIdentifier(e.target.value);
          setError("");
        }}
        label="Mobile number, username or email"
      />
      <InputField
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
        label="Password"
        type="password"
      />

      {error && (
        <p style={{ color: "#d32f2f", fontSize: "14px", marginTop: "8px" }}>
          {error}
        </p>
      )}
      <Button onClick={handleLogin} loading={loading} sx={{ mt: 2 }}>
        Login
      </Button>
      <Button
        variant="text"
        onClick={() => alert("Coming Soon!")}
        sx={{ mt: 2 }}
      >
        Forgot Password?
      </Button>

      <Divider sx={{ my: 2 }} />

      <GoogleButton />
      <Button
        variant="text"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate("/signup")}
      >
        Create an account
      </Button>
    </AuthLayout>
  );
};

export default Login;
