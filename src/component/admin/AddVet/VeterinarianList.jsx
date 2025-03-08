import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar";

const AdminVeterinarianList = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/veterinarians")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setVeterinarians(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading veterinarians...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-100 to-blue-100">
      <AdminNavbar />
      <div className="p-8 w-full overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">Veterinarian Directory</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {veterinarians.map((vet) => (
            <div key={vet._id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
              <img 
                src={`http://localhost:3001${vet.image}`} 
                alt={vet.name} 
                className="w-32 h-32 rounded-full border-2 border-purple-500 object-cover" 
              />
              <h3 className="text-xl font-semibold text-purple-700 mt-3">{vet.name}</h3>
              <div className="bg-purple-100 px-3 py-1 rounded-full mt-2">
                <p className="text-purple-700 text-sm">{vet.specialization}</p>
              </div>
              <p className="text-gray-500 mt-2">{vet.experience} years experience</p>
              <p className="text-gray-700 font-medium mt-1">Fee: ${vet.fee}</p>
              <p className="text-gray-500 text-sm mt-3 line-clamp-3">{vet.bio}</p>
              <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminVeterinarianList;