import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Loader = ({ size = 40, fullScreen = false }) => {
  if (fullScreen) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={size} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 2,
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default Loader;
