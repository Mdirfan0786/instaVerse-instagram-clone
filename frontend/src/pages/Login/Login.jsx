import React from "react";

const Login = () => {
  return (
    <button
      onClick={() =>
        (window.location.href = "http://localhost:7870/api/auth/google")
      }
    >
      Continue with Google
    </button>
  );
};

export default Login;
