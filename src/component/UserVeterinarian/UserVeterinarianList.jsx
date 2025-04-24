import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../Header/NavBar.jsx";
import Footer from "../Footer/Footer";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const UserVeterinarianList = () => {
  const { auth } = useAuth();
  const [veterinarians, setVeterinarians] = useState([]);
  const [filteredVeterinarians, setFilteredVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [expandedVet, setExpandedVet] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const navigate = useNavigate();

  // Function to geocode address to coordinates
  const geocodeAddress = async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      
      if (response.data && response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Get user's location
  useEffect(() => {
    const getUserLocation = () => {
      setLocationLoading(true);
      setLocationError(null);
      
      if (navigator.geolocation) {
        console.log("Requesting user location...");
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("User location obtained:", position.coords);
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setLocationLoading(false);
            
            // Auto-sort by distance when location is available
            setSortOption("distance");
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocationError("Failed to get your location. Location-based sorting is unavailable.");
            setLocationLoading(false);
          },
          { 
            enableHighAccuracy: true, 
            timeout: 10000, 
            maximumAge: 0 
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser. Location-based sorting is unavailable.");
        setLocationLoading(false);
      }
    };
    
    getUserLocation();
  }, []);

  // Fetch veterinarians and geocode their addresses
  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        console.log("Fetching veterinarians from API...");
        const res = await fetch("http://localhost:3001/api/veterinarians");
        console.log("API response status:", res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to fetch veterinarians:", errorText);
          throw new Error(`Failed to fetch veterinarians: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Veterinarians fetched successfully:", data.length);
        
        // Process vets to add coordinates if user location is available
        if (userLocation) {
          console.log("User location available, calculating distances...");
          
          const vetsWithCoordinates = await Promise.all(
            data.map(async (vet) => {
              try {
                const coordinates = await geocodeAddress(vet.location);
                if (coordinates) {
                  console.log(`Geocoded location for ${vet.name}:`, coordinates);
                  const distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    coordinates.lat,
                    coordinates.lng
                  );
                  console.log(`Distance to ${vet.name}: ${distance.toFixed(2)} km`);
                  return {
                    ...vet,
                    coordinates,
                    distance: distance
                  };
                }
                console.log(`Could not geocode location for ${vet.name}`);
                return { ...vet, distance: Infinity };
              } catch (error) {
                console.error(`Error processing vet ${vet.name}:`, error);
                return { ...vet, distance: Infinity };
              }
            })
          );
          
          setVeterinarians(vetsWithCoordinates);
          
          // Apply distance sorting immediately
          if (sortOption === "distance") {
            const sortedByDistance = [...vetsWithCoordinates].sort(
              (a, b) => (a.distance || Infinity) - (b.distance || Infinity)
            );
            setFilteredVeterinarians(sortedByDistance);
          } else {
            setFilteredVeterinarians(vetsWithCoordinates);
          }
        } else {
          console.log("User location not available, skipping distance calculation");
          setVeterinarians(data);
          setFilteredVeterinarians(data);
        }
      } catch (err) {
        console.error("Error in fetchVeterinarians:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Always attempt to fetch veterinarians
    fetchVeterinarians();
  }, [userLocation, sortOption]);

  const handleSortChange = (e) => {
    const option = e.target.value;
    console.log("Sort option changed to:", option);
    setSortOption(option);

    let sortedVets = [...veterinarians];
    if (option === "distance" && userLocation) {
      console.log("Sorting by distance...");
      sortedVets.sort((a, b) => {
        const distanceA = a.distance || Infinity;
        const distanceB = b.distance || Infinity;
        console.log(`Comparing: ${a.name} (${distanceA} km) vs ${b.name} (${distanceB} km)`);
        return distanceA - distanceB;
      });
    } else if (option === "price-low-high") {
      sortedVets.sort((a, b) => a.fee - b.fee);
    } else if (option === "price-high-low") {
      sortedVets.sort((a, b) => b.fee - a.fee);
    } else {
      // Default to "recommended" - keep original order
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
          <h2 className="text-2xl font-medium mb-4">Connection Error</h2>
          <p className="text-lg font-light mb-4">We couldn't load the veterinarians list:</p>
          <div className="bg-red-50 p-4 rounded-lg text-left text-red-800 mb-4">
            <p>{error}</p>
          </div>
          <p className="text-sm mb-4">
            Please make sure the backend server is running at <span className="font-mono bg-gray-100 px-2 py-1 rounded">http://localhost:3001</span>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
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

          <div className="flex flex-col items-end mb-10">
            <p className="text-green-700 mb-2 font-medium">Filter by:</p>
            <div className="relative inline-block z-10 bg-white rounded-lg shadow-md border border-green-300 hover:border-green-500 transition-colors">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="appearance-none h-12 pl-6 pr-12 text-green-800 bg-transparent font-medium focus:outline-none focus:ring-0 cursor-pointer"
                aria-label="Sort veterinarians"
              >
                <option value="default">Most Recommended</option>
                <option value="distance" disabled={!userLocation}>Shortest Distance</option>
                <option value="price-low-high">Low to High (Fee)</option>
                <option value="price-high-low">High to Low (Fee)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-green-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            
            {/* Location status indicator */}
            {locationLoading && (
              <div className="mt-2 flex items-center text-sm text-amber-600">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Detecting your location...</span>
              </div>
            )}
            
            {locationError && (
              <div className="mt-2 flex items-center text-sm text-red-600">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Location services unavailable</span>
              </div>
            )}
            
            {userLocation && sortOption === "distance" && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Showing nearest veterinarians</span>
              </div>
            )}
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
                    {userLocation && vet.distance && vet.distance !== Infinity && (
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
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                        <span>{vet.distance.toFixed(1)} km away</span>
                      </div>
                    )}
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
                      {auth?.token ? (
                        <span>{vet.phone || "Not provided"}</span>
                      ) : (
                        <Link to="/login" className="text-green-600 hover:text-green-800 flex items-center gap-1">
                          <span>Login to view</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      )}
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