import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const vetIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter the map to user's location
function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 13 });
    
    map.on('locationfound', function(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });

    map.on('locationerror', function(e) {
      setError(e.message);
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

// Main component
const VetLocationMap = () => {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyVets, setNearbyVets] = useState([]);

  // Function to geocode vet addresses to coordinates
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

  // Fetch vets and get their coordinates
  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/veterinarians");
        if (!res.ok) throw new Error("Failed to fetch veterinarians");
        const data = await res.json();
        
        // Process each vet to add coordinates
        const vetsWithCoordinates = await Promise.all(
          data.map(async (vet) => {
            const coordinates = await geocodeAddress(vet.location);
            return {
              ...vet,
              coordinates
            };
          })
        );
        
        setVets(vetsWithCoordinates.filter(vet => vet.coordinates));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vets:", err);
        setLoading(false);
      }
    };

    fetchVets();
  }, []);

  // Get user's location and find nearby vets
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          
          // Find nearby vets (within 10km)
          if (vets.length > 0) {
            const nearby = vets
              .filter(vet => vet.coordinates)
              .map(vet => {
                const distance = calculateDistance(
                  userPos.lat, 
                  userPos.lng, 
                  vet.coordinates.lat, 
                  vet.coordinates.lng
                );
                return { ...vet, distance };
              })
              .filter(vet => vet.distance <= 10) // Show vets within 10km
              .sort((a, b) => a.distance - b.distance);
            
            setNearbyVets(nearby);
          }
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    }
  }, [vets]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-green-700 font-light">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="text-center my-6">
        <h2 className="text-3xl font-light text-green-800">Find Veterinarians Near You</h2>
        <p className="text-gray-600 mt-2">Displaying veterinarians within 10km of your location</p>
      </div>

      <div className="flex flex-1 gap-4">
        {/* Map */}
        <div className="w-2/3 h-[70vh] rounded-lg overflow-hidden shadow-md">
          <MapContainer 
            center={[0, 0]} 
            zoom={2} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User's location marker */}
            <LocationMarker />
            
            {/* Vet markers */}
            {vets.map(vet => 
              vet.coordinates && (
                <Marker 
                  key={vet._id} 
                  position={[vet.coordinates.lat, vet.coordinates.lng]} 
                  icon={vetIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-medium text-green-700">{vet.name}</h3>
                      <p className="text-sm">{vet.specialization}</p>
                      <p className="text-sm">{vet.location}</p>
                      {userLocation && (
                        <p className="text-xs mt-1">
                          {calculateDistance(
                            userLocation.lat, 
                            userLocation.lng, 
                            vet.coordinates.lat, 
                            vet.coordinates.lng
                          ).toFixed(1)} km away
                        </p>
                      )}
                      <button 
                        className="mt-2 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        onClick={() => window.location.href = `/bookingsystem?vet=${vet._id}`}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )
            )}
          </MapContainer>
        </div>
        
        {/* Nearby vets list */}
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-md overflow-y-auto">
          <h3 className="text-xl font-medium text-green-800 mb-4">Nearest Veterinarians</h3>
          {nearbyVets.length > 0 ? (
            <div className="space-y-4">
              {nearbyVets.map(vet => (
                <div 
                  key={vet._id} 
                  className="border border-gray-200 p-3 rounded-lg hover:border-green-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={`http://localhost:3001${vet.image || "/uploads/default.jpg"}`}
                      alt={vet.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/48"; }}
                    />
                    <div>
                      <h4 className="font-medium text-green-700">{vet.name}</h4>
                      <p className="text-sm text-gray-600">{vet.specialization}</p>
                      <p className="text-xs text-gray-500">{vet.distance.toFixed(1)} km away</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">{vet.location}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-green-600">Fee: ${vet.fee.toFixed(2)}</span>
                      <button 
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        onClick={() => window.location.href = `/bookingsystem?vet=${vet._id}`}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No veterinarians found within 10km of your location.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VetLocationMap; 