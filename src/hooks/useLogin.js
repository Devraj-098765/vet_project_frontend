
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "./useAuth";
import axiosInstance from "../api/axios";

const LOGIN_URL = "/auth";

const useSignup = () => {
  const { setAuth } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuthLogin = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post(LOGIN_URL, data);
      const token = response.headers["x-auth-token"];

      if (token) {
        localStorage.setItem("vetapp-token", token);
        localStorage.setItem("vetapp-email", data.email);
        localStorage.setItem("vetapp-userId", response.data._id);
        
        setAuth({
          email: data.email,
          _id: response.data._id,
          token,
        });
      }

      toast.success("User Logged In successfully");
      navigate("/");
      localStorage.setItem("email", data.email);
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleAuthLogin, loading, error };
};

export default useSignup;
