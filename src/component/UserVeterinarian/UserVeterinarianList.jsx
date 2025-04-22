import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Header/NavBar";
import Footer from "../Footer/Footer";

const UserVeterinarianList = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [filteredVeterinarians, setFilteredVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [expandedVet, setExpandedVet] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/veterinarians");
        if (!res.ok) throw new Error("Failed to fetch veterinarians");
        const data = await res.json();
        setVeterinarians(data);
        setFilteredVeterinarians(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinarians();
  }, []);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedVets = [...veterinarians];
    if (option === "alphabetical-asc") {
      sortedVets.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "alphabetical-desc") {
      sortedVets.sort((a, b) => b.name.localeCompare(a.name));
    } else if (option === "specialization") {
      sortedVets.sort((a, b) => a.specialization.localeCompare(b.specialization));
    } else if (option === "price-low-high") {
      sortedVets.sort((a, b) => a.fee - b.fee);
    } else if (option === "price-high-low") {
      sortedVets.sort((a, b) => b.fee - a.fee);
    } else {
      sortedVets = [...veterinarians];
    }
    setFilteredVeterinarians(sortedVets);
  };

  const handleBookAppointment = (vet) => {
    if (!vet.isActive) {
      alert("This veterinarian is currently unavailable for booking.");
      return;
    }
    navigate(`/bookingsystem`, { state: { vet } });
  };

  const toggleBio = (vetId) => {
    setExpandedVet(expandedVet === vetId ? null : vetId);
  };

  const truncateBio = (text, maxLength = 70) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-green-700 font-light">Loading our specialists...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <div className="text-center text-red-600 p-8 rounded-lg bg-white shadow-lg max-w-md">
          <p className="text-xl font-light">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <>
      <div className="flex justify-center items-center">
        <NavBar />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-green-800 sm:text-5xl tracking-tight">
              Our Distinguished Specialists
            </h2>
            <div className="mt-2 mb-4 w-24 h-1 bg-green-500 mx-auto"></div>
            <p className="mt-6 text-lg text-green-600 max-w-2xl mx-auto font-light italic">
              Exceptional care provided by our highly-qualified veterinary professionals
            </p>
          </div>

          <div className="flex justify-end mb-10">
            <div className="relative inline-block z-10 bg-white rounded-lg shadow-sm border border-green-200">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="appearance-none h-12 pl-6 pr-10 text-green-800 bg-transparent font-light focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="default">Sort by Recommended</option>
                <option value="alphabetical-asc">Sort by Name (A-Z)</option>
                <option value="alphabetical-desc">Sort by Name (Z-A)</option>
                <option value="specialization">Sort by Specialty</option>
                <option value="price-low-high">Sort by Price: Low to High</option>
                <option value="price-high-low">Sort by Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-green-500">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredVeterinarians.map((vet) => (
              <div
                key={vet._id}
                className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
              >
                {/* Top curved shape */}
                <div className="absolute top-0 left-0 w-full h-32 bg-green-600 rounded-b-full transform scale-150"></div>

                {/* Image with circular crop */}
                <div className="relative z-10 mx-auto mt-6 w-36 h-36 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  <img
                    src={`http://localhost:3001${vet.image || "/uploads/default.jpg"}`}
                    alt={vet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                  />
                </div>

                {/* Content */}
                <div className="p-6 text-center mt-4">
                  <h3 className="text-2xl font-light text-green-800">{vet.name}</h3>
                  <div className="flex justify-center mt-2 space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {vet.specialization}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        vet.isActive ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {vet.isActive ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-green-700 font-light">
                    <div className="flex justify-center items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{vet.location || "Not provided"}</span>
                    </div>
                    <div className="flex justify-center items-center gap-2 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{vet.phone || "Not provided"}</span>
                    </div>
                    <div className="flex justify-center items-center gap-2 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Fee: ${vet.fee.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-4 min-h-16 text-green-700 font-light leading-relaxed">
                    {expandedVet === vet._id ? (
                      <p>{vet.bio}</p>
                    ) : (
                      <p>{truncateBio(vet.bio)}</p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => toggleBio(vet._id)}
                      className="flex-1 py-2 px-4 bg-white border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition duration-300 font-light"
                    >
                      {expandedVet === vet._id ? "Show Less" : "About Me"}
                    </button>
                    <button
                      onClick={() => handleBookAppointment(vet)}
                      className={`flex-1 py-2 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg font-light ${
                        vet.isActive
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                      disabled={!vet.isActive}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default UserVeterinarianList;