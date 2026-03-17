import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import AuthLayout from "../../components/auth/authLayout";
import InputField from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import { Divider } from "@mui/material";
import { clientServer } from "../../api/axios";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    identifier: "",
    password: "",
  });

  const { Login, user } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validating fields
    if (!form.name || !form.username || !form.identifier || !form.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    // Password minimun length checking
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const cleanForm = {
        ...form,
        username: form.username.trim(),
        name: form.name.trim().replace(/\s+/g, " "),
        identifier: form.identifier.trim(),
      };

      const res = await clientServer.post("/auth/register", cleanForm);

      Login(res.data.user, res.data.token);

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign up to Instaverse">
      <InputField
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <InputField
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
      />

      <InputField
        label="Mobile number or email"
        name="identifier"
        value={form.identifier}
        onChange={handleChange}
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />

      {error && (
        <p style={{ color: "#d32f2f", fontSize: "14px", marginTop: "8px" }}>
          {error}
        </p>
      )}

      <Button onClick={handleSignup} loading={loading} sx={{ mt: 2 }}>
        Sign Up
      </Button>

      <Divider sx={{ my: 2 }} />

      <Button variant="text" fullWidth onClick={() => navigate("/login")}>
        Already have an account? Login
      </Button>
    </AuthLayout>
  );
};

export default Register;
