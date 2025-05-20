import React, { useState, useEffect } from "react";
import {FiUser,FiEdit,FiSave, FiX, FiLock, FiPhone,FiMail,FiBriefcase,FiCheckCircle,FiAlertCircle,FiMapPin,FiDollarSign,FiCalendar,FiFileText, FiCamera, FiInfo, FiToggleRight, FiToggleLeft} from "react-icons/fi";
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
        const currentStatus = profile.status || (profile.isActive ? 'active' : 'inactive');
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        const veterinarianId = profile._id;

        if (!veterinarianId) {
          toast.error("User ID missing. Please log in again.");
          return;
        }

        console.log("Updating status for ID:", veterinarianId);
        console.log("Current status:", currentStatus);
        console.log("New status:", newStatus);

        const userId = localStorage.getItem("vetapp-userId");
        const userRole = localStorage.getItem("vetapp-role");

        if (userId !== veterinarianId && userRole !== "admin") {
          console.log("Token userId:", userId, "Profile ID:", veterinarianId);
          toast.error("Authorization error: You can only update your own profile.");
          return;
        }

        const dataToSend = {
          status: newStatus
        };

        const updateUrl = `/veterinarians/${veterinarianId}/status`;
        console.log("Sending status update to:", updateUrl, "with data:", dataToSend);

        const response = await axiosInstance.patch(updateUrl, dataToSend, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": auth.token,
          },
        });

        console.log("Status update response:", response.data);

        // Update both status and isActive properties in the profile state
        setProfile((prev) => ({
          ...prev,
          status: newStatus,
          isActive: newStatus === 'active'
        }));

        const statusMessage = newStatus === 'active' ? 'Active' : 'Inactive';
        toast.success(`Status updated to ${statusMessage}`);
        
        if (newStatus === 'inactive') {
          toast.info("You can still log in to the system while your account is inactive, but you won't be visible to clients.");
        }
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
      <div className="flex h-screen bg-gradient-to-br from-teal-50 to-teal-100">
        <VeterinarianNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-lg text-teal-700 font-medium">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-teal-50 to-teal-100">
        <VeterinarianNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md border-l-4 border-red-500">
            <FiAlertCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-blue-50/80">
      <VeterinarianNavbar />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with profile summary */}
          <div className="mb-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-full opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 C60,20 40,80 0,100 Z" fill="white" />
              </svg>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="mr-5 bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  <FiUser className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Veterinarian Profile</h1>
                  <p className="text-teal-100 mt-1">
                    {profile.name ? `Welcome, Dr. ${profile.name}` : "Manage your professional information"}
                  </p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-5 py-2.5 bg-white text-teal-700 rounded-lg hover:bg-teal-50 transition-colors shadow-md"
                >
                  <FiEdit className="mr-2" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-5 py-2.5 bg-teal-100 text-teal-800 rounded-lg hover:bg-teal-200 transition-colors shadow-md"
                  >
                    <FiSave className="mr-2" /> Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-5 py-2.5 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-md"
                  >
                    <FiX className="mr-2" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Image & Status */}
            <div className="col-span-1 space-y-8">
              {/* Profile Image Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
                <div className="bg-teal-500 p-4 text-white flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center">
                    <FiUser className="mr-2" /> Profile Image
                  </h2>
                </div>
                <div className="p-8 flex flex-col items-center bg-gradient-to-b from-teal-50 to-white">
                  <div className="relative w-48 h-48 rounded-xl border-4 border-teal-100 shadow-md mb-6 overflow-hidden bg-white">
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
                          e.target.src = "https://via.placeholder.com/150?text=Veterinarian";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-teal-50">
                        <FiUser className="text-7xl text-teal-300" />
                      </div>
                    )}
                    
                    {isEditing && (
                      <div className="absolute inset-0 bg-teal-900 bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                           onClick={() => document.getElementById('profile-image-upload').click()}>
                        <FiCamera className="text-white text-4xl" />
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-center">
                    <p className="font-medium text-gray-800 text-lg">{profile.name || "Add Your Name"}</p>
                    <p className="text-teal-600">{profile.specialization || "Add Your Specialization"}</p>
                  </div>
                </div>
              </div>
              
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
                <div className="bg-teal-500 p-4 text-white">
                  <h2 className="text-lg font-semibold flex items-center">
                    <FiToggleRight className="mr-2" /> Availability Status
                  </h2>
                </div>
                <div className="p-6 bg-gradient-to-b from-teal-50 to-white">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-teal-100 bg-white">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex w-4 h-4 rounded-full mr-3 ${
                          (isEditing ? formData.isActive : profile.isActive)
                            ? "bg-teal-500"
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
                      className="cursor-pointer transition-transform hover:scale-105"
                      role="button"
                      aria-label="Toggle active status"
                    >
                      {(isEditing ? formData.isActive : profile.isActive) ? (
                        <FiToggleRight className="text-3xl text-teal-500" />
                      ) : (
                        <FiToggleLeft className="text-3xl text-gray-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    {(isEditing ? formData.isActive : profile.isActive)
                      ? "You are visible to clients and can receive appointments"
                      : "You are not visible to clients and cannot receive appointments"}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
                <div className="bg-teal-500 p-4 text-white">
                  <h2 className="text-lg font-semibold flex items-center">
                    <FiFileText className="mr-2" /> Quick Info
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-teal-50 rounded-lg text-center">
                      <p className="text-sm text-teal-600 mb-1">Experience</p>
                      <p className="text-xl font-bold text-teal-800">{profile.experience || "0"} Years</p>
                    </div>
                    <div className="p-4 bg-teal-50 rounded-lg text-center">
                      <p className="text-sm text-teal-600 mb-1">Fee</p>
                      <p className="text-xl font-bold text-teal-800">${profile.fee || "0"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Profile Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
                <div className="bg-teal-500 p-4 text-white flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center">
                    <FiUser className="mr-2" /> Personal Information
                  </h2>
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <FiInfo className="text-white" />
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-b from-teal-50 to-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-teal-700 flex items-center">
                        <FiUser className="mr-2 text-teal-500" /> Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                          placeholder="Dr. Full Name"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-white rounded-xl border border-teal-100">
                          <p className="text-gray-800">{profile.name || "Not specified"}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-teal-700 flex items-center">
                        <FiMail className="mr-2 text-teal-500" /> Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50"
                          placeholder="email@example.com"
                          disabled
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-white rounded-xl border border-teal-100">
                          <p className="text-gray-800">{profile.email || "Not specified"}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-teal-700 flex items-center">
                        <FiBriefcase className="mr-2 text-teal-500" /> Specialty
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                          placeholder="Your specialty"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-white rounded-xl border border-teal-100">
                          <p className="text-gray-800">{profile.specialization || "Not specified"}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-teal-700 flex items-center">
                        <FiPhone className="mr-2 text-teal-500" /> Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                          placeholder="Your phone number"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-white rounded-xl border border-teal-100">
                          <p className="text-gray-800">{profile.phone || "Not specified"}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-teal-700 flex items-center">
                        <FiDollarSign className="mr-2 text-teal-500" /> Consultation Fee
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="fee"
                          value={formData.fee}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                          placeholder="Fee amount"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-white rounded-xl border border-teal-100">
                          <p className="text-gray-800">${profile.fee || "0"}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-teal-700 flex items-center">
                        <FiCalendar className="mr-2 text-teal-500" /> Experience
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                          placeholder="Years of experience"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-white rounded-xl border border-teal-100">
                          <p className="text-gray-800">{profile.experience || "Not specified"} years</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-teal-700 flex items-center">
                        <FiMapPin className="mr-2 text-teal-500" /> Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                          placeholder="Your location"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-white rounded-xl border border-teal-100">
                          <p className="text-gray-800">{profile.location || "Not specified"}</p>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-teal-700 flex items-center">
                        <FiFileText className="mr-2 text-teal-500" /> Professional Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                          placeholder="Tell us about yourself"
                          rows={4}
                        />
                      ) : (
                        <div className="p-4 bg-white rounded-xl border border-teal-100 min-h-[100px]">
                          <p className="text-gray-700">{profile.bio || "No bio information provided yet."}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
                <div className="bg-teal-500 p-4 text-white flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center">
                    <FiLock className="mr-2" /> Security Settings
                  </h2>
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <FiInfo className="text-white" />
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-b from-teal-50 to-white">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-600">
                      {showPasswordForm 
                        ? "Update your password below" 
                        : "Secure your account by regularly updating your password"}
                    </p>
                    <button
                      onClick={togglePasswordForm}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                        showPasswordForm
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-teal-500 text-white hover:bg-teal-600"
                      }`}
                    >
                      <FiLock className="mr-2" /> {showPasswordForm ? "Cancel" : "Change Password"}
                    </button>
                  </div>

                  {showPasswordForm && (
                    <form
                      onSubmit={handlePasswordUpdate}
                      className="bg-white p-6 rounded-xl border border-teal-100 shadow-inner"
                    >
                      {passwordError && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start">
                          <FiAlertCircle className="mr-2 mt-1 text-red-500 flex-shrink-0" />
                          <p>{passwordError}</p>
                        </div>
                      )}

                      {passwordSuccess && (
                        <div className="mb-4 p-3 bg-teal-50 border-l-4 border-teal-500 text-teal-700 rounded-md flex items-start">
                          <FiCheckCircle className="mr-2 mt-1 text-teal-500 flex-shrink-0" />
                          <p>{passwordSuccess}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-teal-700 mb-2 flex items-center">
                            <FiLock className="mr-2 text-teal-500" /> Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-teal-700 mb-2 flex items-center">
                            <FiLock className="mr-2 text-teal-500" /> New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                          />
                          <p className="text-xs text-teal-600 mt-1 flex items-center">
                            <FiInfo className="mr-1" /> Password must be at least 8 characters long
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-teal-700 mb-2 flex items-center">
                            <FiLock className="mr-2 text-teal-500" /> Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="submit"
                          className="w-full py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors shadow-md font-medium flex items-center justify-center"
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