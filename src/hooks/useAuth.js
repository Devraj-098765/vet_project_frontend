import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  return authContext;
};

export default useAuth;
