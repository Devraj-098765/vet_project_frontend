import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Required for VeterinarianNavbar
import VeterinarianNavbar from "../SideBarVeterinarian/SideBarVeterinarian"; // Assuming it's in the same directory or adjust the path

const Dashboard = () => (
  <div className="p-5">
    <h2 className="text-xl font-semibold">Dashboard</h2>
    <div className="grid grid-cols-3 gap-5 mt-5">
      {[
        { title: "Total Appointments", value: 25 },
        { title: "Upcoming Appointments", value: 10 },
        { title: "Pending Requests", value: 5 },
      ].map(({ title, value }) => (
        <div key={title} className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-gray-600">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      ))}
    </div>
  </div>
);

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/api/bookings");
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold">Appointments</h2>
      <ul className="mt-5">
        {appointments.length > 0 ? (
          appointments.map((appt, index) => (
            <li key={index} className="bg-white p-3 rounded-lg shadow mb-3">
              {`${appt.petName} - ${appt.time}`}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No upcoming appointments.</p>
        )}
      </ul>
    </div>
  );
};

const VetDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  // Map navbar routes to local component states
  const handleNavigation = (route, name) => {
    switch (name) {
      case "Appointments":
        setActivePage("appointments");
        break;
      case "Pet List":
        setActivePage("petlist"); // Placeholder; add component if needed
        break;
      case "Reports":
        setActivePage("reports"); // Placeholder; add component if needed
        break;
      case "Profile":
        setActivePage("profile"); // Placeholder; add component if needed
        break;
      default:
        setActivePage("dashboard");
    }
    navigate(route); // Still navigate to the route for URL consistency
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <VeterinarianNavbar /> {/* Imported Navbar */}
      <div className="flex-1 p-5">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "appointments" && <Appointments />}
        {/* Add placeholders or components for other pages if needed */}
        {activePage === "petlist" && <div className="p-5">Pet List Placeholder</div>}
        {activePage === "reports" && <div className="p-5">Reports Placeholder</div>}
        {activePage === "profile" && <div className="p-5">Profile Placeholder</div>}
      </div>
    </div>
  );
};

export default VetDashboard;