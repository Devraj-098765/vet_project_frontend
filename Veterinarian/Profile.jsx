import React, { useState, useEffect } from "react";
import { FiUser,FiEdit,FiSave,FiX,FiLock, FiPhone, FiMail, FiBriefcase,FiCheckCircle,FiAlertCircle} from "react-icons/fi";
import VeterinarianNavbar from "../Veterinarian/SideBarVeterinarian/SideBarVeterinarian.jsx"

const VeterinarianProfile = () => {
  // State for profile data
  const [profile, setProfile] = useState({
    name: "Dr. test123",
    email: "test123@vetcare.com",
    specialty: "Veterinary Surgeon",
    phone: "9840753049",
    imageUrl: null,
    isActive: true
  });

  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State for temporary form data while editing
  const [formData, setFormData] = useState({ ...profile });

  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Simulate fetching profile data
  useEffect(() => {
    // Replace with actual API call if needed
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

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError(""); // Clear errors when user types
  };

  // Handle status toggle
  const handleStatusToggle = () => {
    if (isEditing) {
      setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
    } else {
      setProfile((prev) => ({ ...prev, isActive: !prev.isActive }));
      // Add API call to update status if needed
    }
  };

  // Save changes
  const handleSave = () => {
    setProfile({ ...formData });
    setIsEditing(false);
    // Add API call to save changes if needed
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  // Toggle password form
  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    // Reset the form and messages when toggling
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordError("");
    setPasswordSuccess("");
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirmation do not match");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    try {
      // Simulate API call
      // const response = await api.put('/vet/change-password', passwordData);
      
      // Success handling
      setPasswordSuccess("Password updated successfully");
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess("");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }, 2000);
    } catch (error) {
      setPasswordError("Failed to update password. Please check your current password.");
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar Navbar */}
      <VeterinarianNavbar />
      
      {/* Main Content */}
      <div className="flex-1 p-5">
        <div className="max-w-4xl mx-auto mt-8 p-8 bg-white rounded-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <span className="bg-green-100 p-2 rounded-full mr-3 text-green-600">
                <FiUser className="text-xl" />
              </span>
              Veterinarian Profile
            </h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md transform hover:translate-y-px"
              >
                <FiEdit className="mr-2" /> Edit Profile
              </button>
            ) : (
              <div className="flex mt-4 sm:mt-0 space-x-3">
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md transform hover:translate-y-px"
                >
                  <FiSave className="mr-2" /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md transform hover:translate-y-px"
                >
                  <FiX className="mr-2" /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Profile Image and Status */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-36 h-36 rounded-full bg-gray-100 border-4 border-green-50 shadow-md overflow-hidden flex items-center justify-center">
                  {profile.imageUrl ? (
                    <img
                      src={profile.imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-6xl text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <div className="w-full">
                    <label className="px-4 py-2 bg-green-50 text-green-700 rounded-lg cursor-pointer w-full text-center block hover:bg-green-100 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { 
                          const file = e.target.files[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setFormData((prev) => ({ ...prev, imageUrl }));
                          }
                        }}
                      />
                      Upload Photo
                    </label>
                  </div>
                )}
                <div className="flex items-center mt-2 space-x-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      (isEditing ? formData.isActive : profile.isActive)
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="text-sm font-medium text-gray-600">
                    {(isEditing ? formData.isActive : profile.isActive)
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Account Status
                  </label>
                  <div
                    onClick={handleStatusToggle}
                    className={`relative inline-flex items-center h-6 w-12 rounded-full cursor-pointer transition-colors ${
                      (isEditing ? formData.isActive : profile.isActive)
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${
                        (isEditing ? formData.isActive : profile.isActive)
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {(isEditing ? formData.isActive : profile.isActive)
                    ? "You are currently visible to clients and can receive appointments."
                    : "You are currently not visible to clients and cannot receive appointments."}
                </p>
              </div>
            </div>

            {/* Right Column - Profile Details and Password Change */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Details Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="Dr. Full Name"
                      />
                    ) : (
                      <div className="flex items-center">
                        <FiUser className="text-green-600 mr-2" />
                        <p className="text-gray-800 font-medium">{profile.name}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="email@example.com"
                      />
                    ) : (
                      <div className="flex items-center">
                        <FiMail className="text-green-600 mr-2" />
                        <p className="text-gray-800 font-medium">{profile.email}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Specialty
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="Your specialty"
                      />
                    ) : (
                      <div className="flex items-center">
                        <FiBriefcase className="text-green-600 mr-2" />
                        <p className="text-gray-800 font-medium">{profile.specialty}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="Your phone number"
                      />
                    ) : (
                      <div className="flex items-center">
                        <FiPhone className="text-green-600 mr-2" />
                        <p className="text-gray-800 font-medium">{profile.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Change Section */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FiLock className="text-green-600 mr-2" /> Security Settings
                  </h2>
                  <button
                    onClick={togglePasswordForm}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      showPasswordForm
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {showPasswordForm ? "Cancel" : "Change Password"}
                  </button>
                </div>

                {showPasswordForm ? (
                  <form
                    onSubmit={handlePasswordUpdate}
                    className="bg-gray-50 p-5 rounded-lg border border-gray-200"
                  >
                    {passwordError && (
                      <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start">
                        <FiAlertCircle className="mr-2 mt-1 text-red-500 flex-shrink-0" />
                        <p>{passwordError}</p>
                      </div>
                    )}
                    
                    {passwordSuccess && (
                      <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-start">
                        <FiCheckCircle className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                        <p>{passwordSuccess}</p>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Password must be at least 8 characters long
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md transform hover:translate-y-px font-medium"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-600">
                    Secure your account by regularly updating your password.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeterinarianProfile;
