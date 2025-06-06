import { createContext, ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vetapp-token");
    const email = localStorage.getItem("vetapp-email");
    const userId = localStorage.getItem("vetapp-userId");

    if (token) {
      setAuth({ email, userId, token });
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("vetapp-token");
    localStorage.removeItem("vetapp-email");
    localStorage.removeItem("vetapp-userId");
    setAuth({ });
  };

  if (loading) {
    return (
      <span className="loading loading-dots loading-lg flex item-center mx-auto">
        Loading...
      </span>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
