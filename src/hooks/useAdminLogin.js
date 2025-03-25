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
//       console.log("Response:", response.data);
//       const token = response.headers["x-auth-token"];

//       if (token) {
//         localStorage.setItem("vetapp-token", token);

//         setAuth({
//           email: data.email,
//           role: data.role,
//           token,
//         });
//       }

//       toast.success(`${data.role} Logged In successfully`);

//       // Navigate based on role
//       if (data.role === "admin") {
//         navigate("/adminDashboard");
//       } else if (data.role === "veterinarian") {
//         navigate("/VeterinarianDashboard");
//       }
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

      if (token && response.data.role) {
        const serverRole = response.data.role.toLowerCase(); // Normalize role
        localStorage.setItem("vetapp-token", token);

        setAuth({
          email: data.email,
          role: serverRole,
          token,
        });

        toast.success(`${serverRole} Logged In successfully`);

        if (serverRole === "admin") {
          navigate("/adminDashboard");
        } else if (serverRole === "veterinarian") {
          navigate("/VeterinarianDashboard");
        } else {
          setError("Invalid role received from server");
          toast.error("Login failed: Invalid role");
        }
      } else {
        throw new Error("No token or role received from server");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      toast.error(error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return { handleAdminLogin, loading, error };
};

export default useAdminLogin;