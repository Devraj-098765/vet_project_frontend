import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const 
ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
