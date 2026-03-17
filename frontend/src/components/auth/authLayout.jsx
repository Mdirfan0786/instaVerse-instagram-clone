import React from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import authImage from "../../assets/images/auth_preview.webp";

const AuthLayout = ({ children, title }) => {
  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
      }}
    >
      {/* LEFT SIDE */}
      <Grid
        size={{ xs: 0, md: 7 }}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#fafafa",
          p: 4,
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src="/logo.png"
          alt="Instaverse Logo"
          sx={{
            width: "120px",
            mb: 2,
          }}
        />

        {/* Tagline */}
        <Typography variant="h5" textAlign="center" mb={3}>
          See moments from your{" "}
          <span style={{ color: "#e1306c" }}>close friends</span>
        </Typography>

        {/* Image */}
        <Box
          component="img"
          src={authImage}
          alt="preview"
          sx={{
            width: "80%",
            maxWidth: 400,
          }}
        />
      </Grid>

      {/* RIGHT SIDE */}
      <Grid
        size={{ xs: 12, md: 5 }}
        component={Paper}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff",
          borderLeft: "3px solid #DDE2E8",
        }}
      >
        <Box
          elevation={3}
          sx={{
            width: "100%",
            p: 4,
          }}
        >
          {/* TITLE */}
          <Typography
            variant="h5"
            align="center"
            fontWeight={700}
            mb={2}
            sx={{
              background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </Typography>

          {children}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
