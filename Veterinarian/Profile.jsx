import React, { useState, useEffect } from "react";
import { FiUser, FiEdit, FiSave, FiX } from "react-icons/fi";

const VeterinarianProfile = () => {
  // State for profile data
  const [profile, setProfile] = useState({
<<<<<<< HEAD
    name: "Dr. test123",
    email: "test123@vetcare.com",
    specialty: "Veterinary Surgeon",
    phone: "9840753049",
=======
    name: "Dr. John Doe",
    email: "john.doe@vetcare.com",
    specialty: "Veterinary Surgeon",
    phone: "555-0123",
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
    imageUrl: null,
    isActive: true
  });

  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State for temporary form data while editing
  const [formData, setFormData] = useState({ ...profile });

  // Simulate fetching profile data
  useEffect(() => {
    // Replace with actual API call
    const fetchProfile = async () => {
      try {
        // const response = await api.get('/vet/profile');
        // setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle status toggle
  const handleStatusToggle = () => {
    if (isEditing) {
      setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
    } else {
      // Direct toggle when not in edit mode (optional)
      setProfile((prev) => ({ ...prev, isActive: !prev.isActive }));
      // Add API call to update status
      // api.patch('/vet/profile', { isActive: !profile.isActive });
    }
  };

  // Save changes
  const handleSave = () => {
    setProfile({ ...formData });
    setIsEditing(false);
    // Add API call to save changes
    // api.put('/vet/profile', formData);
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  return (
<<<<<<< HEAD
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-green-50 rounded-xl shadow-lg border border-green-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-900">Veterinarian Profile</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
=======
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Veterinarian Profile</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
          >
            <FiEdit className="mr-2" /> Edit Profile
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={handleSave}
<<<<<<< HEAD
              className="flex items-center px-3 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
=======
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
            >
              <FiSave className="mr-2" /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiX className="mr-2" /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Image */}
        <div className="flex items-center space-x-4">
<<<<<<< HEAD
          <div className="w-24 h-24 rounded-full bg-green-100 overflow-hidden flex items-center justify-center border-2 border-green-300">
=======
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
            {profile.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
<<<<<<< HEAD
              <FiUser className="text-4xl text-green-600" />
=======
              <FiUser className="text-4xl text-gray-500" />
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
            )}
          </div>
          {isEditing && (
            <input
              type="file"
              accept="image/*"
<<<<<<< HEAD
              className="text-sm text-green-700"
=======
              className="text-sm text-gray-500"
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
              onChange={(e) => {
                // Handle image upload logic here
                const file = e.target.files[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setFormData((prev) => ({ ...prev, imageUrl }));
                }
              }}
            />
          )}
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
<<<<<<< HEAD
            <label className="block text-sm font-medium text-green-800">Name</label>
=======
            <label className="block text-sm font-medium text-gray-700">Name</label>
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
<<<<<<< HEAD
                className="mt-1 w-full p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 bg-green-50"
              />
            ) : (
              <p className="mt-1 text-green-900 bg-green-100 p-2 rounded-md">{profile.name}</p>
=======
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{profile.name}</p>
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
            )}
          </div>

          <div>
<<<<<<< HEAD
            <label className="block text-sm font-medium text-green-800">Email</label>
=======
            <label className="block text-sm font-medium text-gray-700">Email</label>
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
<<<<<<< HEAD
                className="mt-1 w-full p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 bg-green-50"
              />
            ) : (
              <p className="mt-1 text-green-900 bg-green-100 p-2 rounded-md">{profile.email}</p>
=======
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{profile.email}</p>
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
            )}
          </div>

          <div>
<<<<<<< HEAD
            <label className="block text-sm font-medium text-green-800">Specialty</label>
=======
            <label className="block text-sm font-medium text-gray-700">Specialty</label>
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
            {isEditing ? (
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
<<<<<<< HEAD
                className="mt-1 w-full p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 bg-green-50"
              />
            ) : (
              <p className="mt-1 text-green-900 bg-green-100 p-2 rounded-md">{profile.specialty}</p>
=======
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{profile.specialty}</p>
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
            )}
          </div>

          <div>
<<<<<<< HEAD
            <label className="block text-sm font-medium text-green-800">Phone</label>
=======
            <label className="block text-sm font-medium text-gray-700">Phone</label>
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
<<<<<<< HEAD
                className="mt-1 w-full p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 bg-green-50"
              />
            ) : (
              <p className="mt-1 text-green-900 bg-green-100 p-2 rounded-md">{profile.phone}</p>
=======
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{profile.phone}</p>
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
            )}
          </div>
        </div>

        {/* Active Status Toggle */}
        <div className="flex items-center space-x-4">
<<<<<<< HEAD
          <label className="text-sm font-medium text-green-800">Active Status</label>
=======
          <label className="text-sm font-medium text-gray-700">Active Status</label>
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
          <div
            onClick={handleStatusToggle}
            className={`relative inline-flex items-center h-6 w-11 rounded-full cursor-pointer transition-colors ${
              (isEditing ? formData.isActive : profile.isActive)
                ? "bg-green-600"
                : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${
                (isEditing ? formData.isActive : profile.isActive)
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </div>
<<<<<<< HEAD
          <span className="text-sm text-green-700">
=======
          <span className="text-sm text-gray-600">
>>>>>>> 81322380e15c124f939abfb18c3bd5d3fb04e339
            {(isEditing ? formData.isActive : profile.isActive) ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VeterinarianProfile;