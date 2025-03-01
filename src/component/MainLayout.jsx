import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./Header/Navbar";
import useAuth from "../hooks/useAuth";

const MainLayout = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSignOut = () => {
    alert("I am being clicked");
    localStorage.removeItem("vetapp-token");
    setAuth({});
    navigate("/login");
  };
  
  return (
      <div className="flex-1 flex flex-col h-screen">
        <NavBar onClick={handleSignOut} />
        <main className="flex flex-col justify-between h-screen overflow-y-auto p-6 bg-white">
          <Outlet />
        </main>
      </div>
  );
};

export default MainLayout;
