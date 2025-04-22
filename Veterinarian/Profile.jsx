import React, { useState, useEffect } from "react";
import {FiUser,FiEdit,FiSave, FiX, FiLock, FiPhone,FiMail,FiBriefcase,FiCheckCircle,FiAlertCircle,FiMapPin,FiDollarSign,FiCalendar,FiFileText,} from "react-icons/fi";
import VeterinarianNavbar from "../Veterinarian/SideBarVeterinarian/SideBarVeterinarian.jsx";
import axiosInstance, { getBaseUrl } from "../src/api/axios.js";
import { toast } from "react-toastify";
import useAuth from "../src/hooks/useAuth.js";

const VeterinarianProfile = () => {
  const { auth } = useAuth();

  const [profile, setProfile] = useState({ name: "",email: "",specialization: "",phone: "",image: null,isActive: true,bio: "",experience: "",fee: 0,location: "",});
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

        if (!auth?.token) {
          throw new Error("Authentication token missing. Please log in again.");
        }

        const response = await axiosInstance.get(`/veterinarians/me`, {
          headers: {
            "x-auth-token": auth.token,
          },
        });

        const veterinarian = response.data;
        console.log("Fetched veterinarian:", veterinarian);

        setProfile(veterinarian);
        setFormData(veterinarian);
        localStorage.setItem("vetapp-userId", veterinarian._id);
        localStorage.setItem("vetapp-role", veterinarian.role);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load profile. Please try again.";
        setError(errorMessage);
        setLoading(false);
        toast.error(errorMessage);
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

        const userId = localStorage.getItem("vetapp-userId");
        const userRole = localStorage.getItem("vetapp-role");

        if (userId !== veterinarianId && userRole !== "admin") {
          console.log("Token userId:", userId, "Profile ID:", veterinarianId);
          toast.error("Authorization error: You can only update your own profile.");
          return;
        }

        const dataToSend = {
          isActive: updatedStatus,
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

        setProfile((prev) => ({
          ...prev,
          isActive: response.data.isActive,
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

      const userId = localStorage.getItem("vetapp-userId");
      const userRole = localStorage.getItem("vetapp-role");

      if (userId !== veterinarianId && userRole !== "admin") {
        console.log("Token userId:", userId, "Profile ID:", veterinarianId);
        toast.error("Authorization error: You can only update your own profile.");
        return;
      }

      if (imageFile) {
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
            "x-auth-token": auth.token,
          },
        });

        console.log("Update response:", response.data);
        setProfile(response.data);
      } else {
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
      <div className="flex h-screen bg-gray-50">
        <VeterinarianNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700 mx-auto"></div>
            <p className="mt-4 text-lg text-green-800 font-medium">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <VeterinarianNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
            <FiAlertCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-green-50">
      <VeterinarianNavbar />
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 bg-gradient-to-r from-green-700 to-green-900 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="mr-5 bg-white/10 p-3 rounded-full">
                  <FiUser className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Veterinarian Profile</h1>
                  <p className="text-green-200 mt-1">Manage your professional details</p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-5 py-2.5 bg-white text-green-800 rounded-lg hover:bg-green-100 transition-colors shadow-md"
                >
                  <FiEdit className="mr-2" /> Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-5 py-2.5 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition-colors shadow-md"
                  >
                    <FiSave className="mr-2" /> Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-5 py-2.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors shadow-md"
                  >
                    <FiX className="mr-2" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Image & Status */}
            <div className="col-span-1">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 text-white">
                  <h2 className="text-lg font-semibold">Profile Image</h2>
                </div>
                <div className="p-6 flex flex-col items-center">
                  <div className="relative w-40 h-40 rounded-full border-4 border-green-100 shadow-lg mb-4 overflow-hidden bg-green-50">
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
                      <div className="w-full h-full flex items-center justify-center">
                        <FiUser className="text-6xl text-green-300" />
                      </div>
                    )}
                    
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                           onClick={() => document.getElementById('profile-image-upload').click()}>
                        <FiEdit className="text-white text-2xl" />
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="w-full mb-4">
                      <label className="px-4 py-2 bg-green-100 text-green-700 rounded-lg cursor-pointer w-full text-center block hover:bg-green-200 transition-colors">
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        Change Photo
                      </label>
                    </div>
                  )}
                  
                  <div className="mt-2 text-center">
                    <p className="font-medium text-gray-800">{profile.name}</p>
                    <p className="text-sm text-gray-500">{profile.specialization}</p>
                  </div>
                </div>
              </div>
              
              {/* Status Card */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden mt-6">
                <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 text-white">
                  <h2 className="text-lg font-semibold">Availability Status</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex w-4 h-4 rounded-full mr-3 ${
                          (isEditing ? formData.isActive : profile.isActive)
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></span>
                      <span className="font-medium text-gray-700">
                        {(isEditing ? formData.isActive : profile.isActive)
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>
                    <div
                      onClick={handleStatusToggle}
                      className={`relative inline-flex h-6 w-12 cursor-pointer rounded-full transition-colors ${
                        (isEditing ? formData.isActive : profile.isActive)
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                          (isEditing ? formData.isActive : profile.isActive)
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    {(isEditing ? formData.isActive : profile.isActive)
                      ? "You are visible to clients and can receive appointments"
                      : "You are not visible to clients and cannot receive appointments"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 text-white flex items-center">
                  <FiUser className="mr-2" />
                  <h2 className="text-lg font-semibold">Personal Information</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-green-700">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                          placeholder="Dr. Full Name"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <FiUser className="text-green-600 mr-2" />
                          <p className="text-gray-800">{profile.name}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-green-700">Email Address</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50"
                          placeholder="email@example.com"
                          disabled
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <FiMail className="text-green-600 mr-2" />
                          <p className="text-gray-800">{profile.email}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-green-700">Specialty</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                          placeholder="Your specialty"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <FiBriefcase className="text-green-600 mr-2" />
                          <p className="text-gray-800">{profile.specialization}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-green-700">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                          placeholder="Your phone number"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <FiPhone className="text-green-600 mr-2" />
                          <p className="text-gray-800">{profile.phone}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-green-700">Consultation Fee</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="fee"
                          value={formData.fee}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                          placeholder="Fee amount"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <FiDollarSign className="text-green-600 mr-2" />
                          <p className="text-gray-800">${profile.fee}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-green-700">Experience</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                          placeholder="Years of experience"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <FiCalendar className="text-green-600 mr-2" />
                          <p className="text-gray-800">{profile.experience}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-green-700">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                          placeholder="Your location"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <FiMapPin className="text-green-600 mr-2" />
                          <p className="text-gray-800">{profile.location}</p>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-sm font-medium text-green-700">Bio</label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                          placeholder="Tell us about yourself"
                          rows={4}
                        />
                      ) : (
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-start mb-2">
                            <FiFileText className="text-green-600 mr-2 mt-1" />
                            <p className="text-sm font-medium text-green-700">Professional Bio</p>
                          </div>
                          <p className="text-gray-700">{profile.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 text-white flex items-center">
                  <FiLock className="mr-2" />
                  <h2 className="text-lg font-semibold">Security Settings</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-600">
                      {showPasswordForm 
                        ? "Update your password below" 
                        : "Secure your account by regularly updating your password"}
                    </p>
                    <button
                      onClick={togglePasswordForm}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        showPasswordForm
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-green-700 text-white hover:bg-green-800"
                      }`}
                    >
                      {showPasswordForm ? "Cancel" : "Change Password"}
                    </button>
                  </div>

                  {showPasswordForm && (
                    <form
                      onSubmit={handlePasswordUpdate}
                      className="bg-green-50 p-6 rounded-xl border border-green-100"
                    >
                      {passwordError && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start">
                          <FiAlertCircle className="mr-2 mt-1 text-red-500 flex-shrink-0" />
                          <p>{passwordError}</p>
                          </div>
                      )}

                      {passwordSuccess && (
                        <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md flex items-start">
                          <FiCheckCircle className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                          <p>{passwordSuccess}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-green-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-green-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                          />
                          <p className="text-xs text-green-600 mt-1">
                            Password must be at least 8 characters long
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-green-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="submit"
                          className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors shadow-md font-medium flex items-center justify-center"
                        >
                          <FiLock className="mr-2" />
                          Update Password
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeterinarianProfile;