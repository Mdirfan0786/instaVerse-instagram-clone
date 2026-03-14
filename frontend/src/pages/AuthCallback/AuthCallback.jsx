import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { Login } = useAuth();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      Login(null, token);
      navigate("/home", { replace: true });
    } else {
      navigate("/login");
    }
  }, []);

  return <p>Signing you in...</p>;
};

export default AuthCallback;
