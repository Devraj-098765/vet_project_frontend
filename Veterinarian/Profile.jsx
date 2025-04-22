import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiEdit,
  FiSave,
  FiX,
  FiLock,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import VeterinarianNavbar from "../Veterinarian/SideBarVeterinarian/SideBarVeterinarian.jsx";
import axiosInstance, { getBaseUrl } from "../src/api/axios.js";
import { toast } from "react-toastify";
import useAuth from "../src/hooks/useAuth.js";

const VeterinarianProfile = () => {
  const { auth } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    specialization: "",
    phone: "",
    image: null,
    isActive: true,
    bio: "",
    experience: "",
    fee: 0,
    location: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const baseUrl = getBaseUrl();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log("Fetching profile with token:", auth?.token);

        const response = await axiosInstance.get(`/veterinarians`);
        const veterinarians = response.data;
        console.log("All veterinarians:", veterinarians);

        if (auth?.token) {
          const base64Url = auth.token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );

          const decoded = JSON.parse(jsonPayload);
          console.log("Decoded token:", decoded);
          
          // Store the userId and role in localStorage for future use
          localStorage.setItem("vetapp-userId", decoded._id);
          if (decoded.role) {
            localStorage.setItem("vetapp-role", decoded.role);
          }

          const currentVet = veterinarians.find((vet) => vet.email === decoded.email || vet._id === decoded._id);

          if (currentVet) {
            console.log("Found veterinarian:", currentVet);
            setProfile(currentVet);
            setFormData(currentVet);
            setLoading(false);
          } else {
            console.error("Veterinarian not found for email:", decoded.email);
            setError("Profile not found. Please contact support.");
            setLoading(false);
          }
        } else {
          setError("Authentication token missing. Please log in again.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again.");
        setLoading(false);
      }
    };

    if (auth?.token) {
      fetchProfile();
    } else {
      setError("Not logged in. Please log in to view your profile.");
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    if (!loading && profile) {
      setFormData({ ...profile });
    }
  }, [profile, loading]);

  const formatImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${baseUrl}${imagePath}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  const handleStatusToggle = async () => {
    if (isEditing) {
      // Just update the form data if we're in edit mode
      setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
    } else {
      try {
        const updatedStatus = !profile.isActive;
        const veterinarianId = profile._id;

        if (!veterinarianId) {
          toast.error("User ID missing. Please log in again.");
          return;
        }

        console.log("Updating status for ID:", veterinarianId);
        console.log("Current isActive value:", profile.isActive);
        console.log("New isActive value:", updatedStatus);
        
        // Verify this matches the user ID in the token or localStorage
        const userId = localStorage.getItem("vetapp-userId");
        const userRole = localStorage.getItem("vetapp-role");
        
        if (userId !== veterinarianId && userRole !== "admin") {
          console.log("Token userId:", userId, "Profile ID:", veterinarianId);
          toast.error("Authorization error: You can only update your own profile.");
          return;
        }

        // Use a regular JSON object instead of FormData for clearer data handling
        const dataToSend = {
          isActive: updatedStatus
        };

        const updateUrl = `/veterinarians/${veterinarianId}`;
        console.log("Sending status update to:", updateUrl, "with data:", dataToSend);

        const response = await axiosInstance.put(updateUrl, dataToSend, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": auth.token,
          },
        });

        console.log("Status update response:", response.data);

        // Make sure to update the profile with the response data
        setProfile(prev => ({
          ...prev,
          isActive: response.data.isActive
        }));
        
        toast.success(`Status updated to ${response.data.isActive ? "Active" : "Inactive"}`);
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error(
          "Failed to update status: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleSave = async () => {
    try {
      console.log("Saving profile - Current data:", profile);
      console.log("Saving profile - Form data:", formData);
      console.log("Saving profile - ID:", profile._id);

      if (!auth?.token) {
        toast.error("Authentication token missing. Please log in again.");
        return;
      }

      const veterinarianId = profile._id;
      if (!veterinarianId) {
        toast.error("User ID missing. Please log in again.");
        return;
      }

      console.log("Using ID for update:", veterinarianId);

      // Verify this matches the user ID in the token or localStorage
      const userId = localStorage.getItem("vetapp-userId");
      const userRole = localStorage.getItem("vetapp-role");
      
      if (userId !== veterinarianId && userRole !== "admin") {
        console.log("Token userId:", userId, "Profile ID:", veterinarianId);
        toast.error("Authorization error: You can only update your own profile.");
        return;
      }

      // Determine if we need to handle file uploads
      if (imageFile) {
        // Use FormData for file uploads
        const formDataToSend = new FormData();
        const updatableFields = [
          "name",
          "phone",
          "specialization",
          "experience",
          "bio",
          "fee",
          "location",
          "isActive",
        ];

        updatableFields.forEach((field) => {
          if (formData[field] !== undefined) {
            // Convert boolean values to strings for FormData
            if (typeof formData[field] === "boolean") {
              formDataToSend.append(field, formData[field].toString());
              console.log(`Adding field ${field} as string:`, formData[field].toString());
            } else {
              formDataToSend.append(field, formData[field]);
              console.log(`Adding field ${field}:`, formData[field]);
            }
          }
        });

        formDataToSend.append("image", imageFile);
        console.log("Adding image file");

        const updateUrl = `/veterinarians/${veterinarianId}`;
        console.log("Sending form data update to:", updateUrl);

        const response = await axiosInstance.put(updateUrl, formDataToSend, {
          headers: {
            // Don't set Content-Type with FormData
            "x-auth-token": auth.token,
          },
        });

        console.log("Update response:", response.data);
        setProfile(response.data);
      } else {
        // Use JSON for non-file updates
        const dataToSend = {};
        const updatableFields = [
          "name",
          "phone",
          "specialization",
          "experience",
          "bio",
          "fee",
          "location",
          "isActive",
        ];

        updatableFields.forEach((field) => {
          if (formData[field] !== undefined) {
            dataToSend[field] = formData[field];
            console.log(`Adding field ${field} to JSON:`, formData[field]);
          }
        });

        const updateUrl = `/veterinarians/${veterinarianId}`;
        console.log("Sending JSON update to:", updateUrl, "with data:", dataToSend);

        const response = await axiosInstance.put(updateUrl, dataToSend, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": auth.token,
          },
        });

        console.log("Update response:", response.data);
        setProfile(response.data);
      }

      setIsEditing(false);
      setImageFile(null);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      const message = error.response?.data?.message || error.message;
      console.log("Response data:", error.response?.data);
      console.log("Response status:", error.response?.status);
      console.log("Response headers:", error.response?.headers);
      toast.error(`Failed to update profile: ${message}`);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
    setImageFile(null);
  };

  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
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
      const veterinarianId = profile._id;
      if (!veterinarianId) {
        setPasswordError("User ID missing. Please log in again.");
        return;
      }

      console.log("Updating password for ID:", veterinarianId);
      
      // Verify this matches the user ID in the token or localStorage
      const userId = localStorage.getItem("vetapp-userId");
      const userRole = localStorage.getItem("vetapp-role");
      
      if (userId !== veterinarianId) {
        console.log("Token userId:", userId, "Profile ID:", veterinarianId);
        setPasswordError("Authorization error: You can only update your own password.");
        return;
      }

      const response = await axiosInstance.put(
        `/veterinarians/${veterinarianId}/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            "x-auth-token": auth.token,
          },
        }
      );

      console.log("Password update response:", response.data);

      setPasswordSuccess("Password updated successfully");
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess("");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }, 2000);
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update password"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <VeterinarianNavbar />
        <div className="flex-1 p-5 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <VeterinarianNavbar />
        <div className="flex-1 p-5 flex items-center justify-center">
          <div className="text-center text-red-500">
            <FiAlertCircle className="text-5xl mx-auto mb-3" />
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <VeterinarianNavbar />
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
            <div className="md:col-span-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-36 h-36 rounded-full bg-gray-100 border-4 border-green-50 shadow-md overflow-hidden flex items-center justify-center">
                  {(isEditing ? (imageFile ? true : formData.image) : profile.image) ? (
                    <img
                      src={
                        isEditing && imageFile
                          ? URL.createObjectURL(imageFile)
                          : formatImageUrl(isEditing ? formData.image : profile.image)
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", e);
                        e.target.src = "https://via.placeholder.com/150";
                      }}
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
                        onChange={handleImageChange}
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
                    ? "Visible to clients and can receive appointments."
                    : "Not visible to clients and cannot receive appointments."}
                </p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
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
                        disabled
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
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="Your specialty"
                      />
                    ) : (
                      <div className="flex items-center">
                        <FiBriefcase className="text-green-600 mr-2" />
                        <p className="text-gray-800 font-medium">{profile.specialization}</p>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Consultation Fee
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="fee"
                        value={formData.fee}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="Fee amount"
                      />
                    ) : (
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">$</span>
                        <p className="text-gray-800 font-medium">{profile.fee}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Experience
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="Years of experience"
                      />
                    ) : (
                      <div className="flex items-center">
                        <FiBriefcase className="text-green-600 mr-2" />
                        <p className="text-gray-800 font-medium">{profile.experience}</p>
                      </div>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="Tell us about yourself"
                        rows={3}
                      />
                    ) : (
                      <div className="text-gray-800">
                        <p>{profile.bio}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="Your location"
                      />
                    ) : (
                      <div className="flex items-center">
                        <p className="text-gray-800 font-medium">{profile.location}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

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