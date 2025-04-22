
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "./useAuth";
import axiosInstance from "../api/axios";

const LOGIN_URL = "/auth";
const FORGOT_PASSWORD_URL = "/auth/forgot-password";
const RESET_PASSWORD_URL = "/auth/reset-password";
const VALIDATE_TOKEN_URL = "/auth/reset-password";

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
          userId: response.data._id,
          token,
        });
      }

      toast.success("User Logged In successfully");
      navigate("/");
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

  const handleForgetPassword = async (email) => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post(FORGOT_PASSWORD_URL, { email });
      console.log("Response from forgot password:", response.data);
      toast.success(response.data.message);
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

  const handleResetPassword = async (token, newPassword) => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post(
        RESET_PASSWORD_URL,
        { password: newPassword }, // Pass the new password in the request body
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      toast.success(response.data.message || "Password reset successfully.");
      navigate("/login"); // Redirect to login page after successful reset
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

  const validateResetToken = async (token) => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(`${VALIDATE_TOKEN_URL}/${token}`);
      return response.data; // Return the response data if the token is valid
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      }
      throw new Error("Invalid or expired token"); // Throw an error if the token is invalid
    } finally {
      setLoading(false);
    }
  };

  return { handleAuthLogin, loading, error, handleForgetPassword, handleResetPassword, validateResetToken };
};

export default useSignup;
