import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

const USER_INFO_URL = "/users";

const useUserInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axiosInstance.get(USER_INFO_URL);
        setUsers(response.data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchUserList();
  }, []);

  const handleEditUserInfo = async (id, data) => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.put(`${USER_INFO_URL}/${id}`, data);
      console.log("User updated:", response.data);
  
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === id ? response.data : user))
      );
  
      toast.success("User information updated successfully");
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

  return { users, loading, error, handleEditUserInfo };
};


export default useUserInfo;
