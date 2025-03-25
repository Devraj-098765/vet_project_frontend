import { useState } from "react";
import { Home, Calendar, Users, Settings } from "lucide-react";

const Sidebar = ({ setActivePage }) => (
  <div className="w-64 bg-gray-900 text-white h-screen p-5 flex flex-col">
    <h1 className="text-2xl font-bold mb-5">Vet Dashboard</h1>
    <nav>
      {[
        { name: "Dashboard", icon: <Home />, page: "dashboard" },
        { name: "Appointments", icon: <Calendar />, page: "appointments" },
        { name: "Clients", icon: <Users />, page: "clients" },
        { name: "Settings", icon: <Settings />, page: "settings" },
      ].map(({ name, icon, page }) => (
        <button
          key={page}
          onClick={() => setActivePage(page)}
          className="flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-700 w-full text-left"
        >
          {icon} {name}
        </button>
      ))}
    </nav>
  </div>
);

const Dashboard = () => (
  <div className="p-5">
    <h2 className="text-xl font-semibold">Dashboard</h2>
    <div className="grid grid-cols-3 gap-5 mt-5">
      {[
        { title: "Total Appointments", value: 25 },
        { title: "New Clients", value: 10 },
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

const Appointments = () => (
  <div className="p-5">
    <h2 className="text-xl font-semibold">Appointments</h2>
    <ul className="mt-5">
      {["Max - 10 AM", "Bella - 11 AM", "Charlie - 1 PM"].map((appt, index) => (
        <li key={index} className="bg-white p-3 rounded-lg shadow mb-3">
          {appt}
        </li>
      ))}
    </ul>
  </div>
);

const VetDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setActivePage={setActivePage} />
      <div className="flex-1 p-5">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "appointments" && <Appointments />}
      </div>
    </div>
  );
};

export default VetDashboard;