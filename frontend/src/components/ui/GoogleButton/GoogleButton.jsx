import React from "react";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const GoogleButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:7870/api/auth/google";
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<GoogleIcon />}
      onClick={handleGoogleLogin}
      sx={{
        mt: 2,
        py: 1.2,
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 600,
      }}
    >
      Continue with Google
    </Button>
  );
};

export default GoogleButton;
