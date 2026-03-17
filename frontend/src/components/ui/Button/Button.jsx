import React from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";

const Button = ({
  children,
  variant = "contained",
  color = "primary",
  onClick,
  type = "button",
  fullWidth = true,
  loading = false,
  disabled = false,
  sx = {},
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      onClick={onClick}
      type={type}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      sx={{
        py: 1.2,
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 600,
        ...sx,
      }}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </MuiButton>
  );
};

export default Button;
