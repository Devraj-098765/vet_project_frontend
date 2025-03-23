import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "./useAuth";
import axiosInstance from "../api/axios";

const SIGNUP_URL = "/signup";

const useSignup = () => {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuthSignup = async (data) => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post(SIGNUP_URL, data);
      console.log("User created:", response.data);

      const token = response.headers["x-auth-token"];
      if (!token) {
        throw new Error("No token received from server.");
      }

      setAuth({
        name: data.name,
        email: data.email,
        token,
      });

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { handleAuthSignup, loading, error };
};

export default useSignup;
