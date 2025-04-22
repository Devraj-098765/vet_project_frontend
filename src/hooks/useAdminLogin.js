import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "./useAuth";
import axiosInstance from "../api/axios";

const LOGIN_URL = "/admin";

const useAdminLogin = () => {
  const { setAuth } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post(LOGIN_URL, data);
      const token = response.headers["x-auth-token"];

      if (token) {
        localStorage.setItem("vetapp-token", token);

        setAuth({
          email: data.email,
          role: data.role,
          token,
        });
      }

      // Navigate based on role
      if (data.role === "admin") {
        navigate("/adminDashboard");
      } else if (data.role === "veterinarian") {
        navigate("/VeterinarianDashboard");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 403) {
          // Handle deactivated account
          setError(err.response.data.message || "Your account has been deactivated. Please contact the administrator.");
          toast.error("Account deactivated", {
            description: "Your account has been deactivated. Please contact the administrator."
          });
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleAdminLogin, loading, error };
};

export default useAdminLogin;
