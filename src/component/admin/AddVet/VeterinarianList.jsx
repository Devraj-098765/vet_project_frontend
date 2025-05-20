import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar";
import { toast } from "react-toastify";

const AdminVeterinarianList = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("vetapp-token");
    
    fetch("http://localhost:3001/api/veterinarians", {
      headers: {
        "x-auth-token": token
      }
    })
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

  const toggleVetStatus = async (vetId, currentStatus) => {
    try {
      const token = localStorage.getItem("vetapp-token");
      if (!token) {
        toast.error("Authentication token missing. Please log in again.");
        return;
      }
      
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const response = await fetch(`http://localhost:3001/api/veterinarians/${vetId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      
      const data = await response.json();

      setVeterinarians((prev) =>
        prev.map((vet) =>
          vet._id === vetId ? { ...vet, status: newStatus } : vet
        )
      );
      
      // Show success message with notification info
      const vet = veterinarians.find(v => v._id === vetId);
      if (newStatus === "inactive") {
        toast.success(`${vet.name}'s account has been deactivated. An email notification has been sent.`);
      } else {
        toast.success(`${vet.name}'s account has been activated. An email notification has been sent.`);
      }
    } catch (error) {
      setError(error.message);
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  const openProfile = (vet) => {
    setSelectedVet(vet);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
              <p className="text-gray-700 font-medium mt-1">
                Status: <span className={vet.status === "active" ? "text-green-600" : "text-red-600"}>{vet.status}</span>
              </p>
              <div className="mt-4 flex gap-2">
                <button 
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={() => openProfile(vet)}
                >
                  View Profile
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    vet.status === "active"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={() => toggleVetStatus(vet._id, vet.status)}
                >
                  {vet.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Modal */}
        {showModal && selectedVet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-purple-800">{selectedVet.name}</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <img 
                  src={`http://localhost:3001${selectedVet.image}`} 
                  alt={selectedVet.name} 
                  className="w-40 h-40 rounded-full border-2 border-purple-500 object-cover mx-auto md:mx-0" 
                />
                
                <div className="flex-1">
                  <div className="bg-purple-100 px-3 py-1 rounded-full inline-block mb-2">
                    <p className="text-purple-700">{selectedVet.specialization}</p>
                  </div>
                  
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Experience:</span> {selectedVet.experience} years
                  </p>
                  
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Fee:</span> ${selectedVet.fee}
                  </p>
                  
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Phone:</span> {selectedVet.phone || "Not provided"}
                  </p>
                  
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Location:</span> {selectedVet.location || "Not provided"}
                  </p>
                  
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Status:</span>{" "}
                    <span className={selectedVet.status === "active" ? "text-green-600" : "text-red-600"}>
                      {selectedVet.status}
                    </span>
                  </p>
                  
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-purple-700 mb-2">📄 Bio</h4>
                    <p className="text-gray-700">{selectedVet.bio}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <button
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    selectedVet.status === "active"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={() => {
                    toggleVetStatus(selectedVet._id, selectedVet.status);
                    const newStatus = selectedVet.status === "active" ? "inactive" : "active";
                    setSelectedVet({ ...selectedVet, status: newStatus });
                  }}
                >
                  {selectedVet.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVeterinarianList;