import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  name,
  error = "",
  placeholder = "",
  fullWidth = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <TextField
      label={label}
      type={isPassword && !showPassword ? "password" : "text"}
      value={value}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      fullWidth={fullWidth}
      margin="normal"
      error={!!error}
      helperText={error}
      InputProps={{
        endAdornment: isPassword && (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default InputField;
