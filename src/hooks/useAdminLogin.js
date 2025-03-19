// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import useAuth from "./useAuth";
// import axiosInstance from "../api/axios";

// const LOGIN_URL = "/admin";

// const useAdminLogin = () => {
//   const { setAuth } = useAuth();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleAdminLogin = async (data) => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await axiosInstance.post(LOGIN_URL, data);
//       const token = response.headers["x-auth-token"];

//       if (token) {
//         localStorage.setItem("vetapp-token", token);

//         setAuth({
//           email: data.email,
//           token,
//         });
//       }

//       toast.success("Admin Logged In successfully");
//       navigate("/adminDashboard");
//     } catch (err) {
//       if (err.response && err.response.data) {
//         if (err.response.data.message) {
//           setError(err.response.data.message);
//         }
//       } else if (err instanceof Error) {
//         setError(err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { handleAdminLogin, loading, error };
// };

// export default useAdminLogin;


// useAdminLogin.js
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
          token,
        });
      }

      toast.success("Admin Logged In successfully");
      navigate("/adminDashboard");
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

  return { handleAdminLogin, loading, error };
};

export default useAdminLogin;