import React, { useState } from "react";
import AdminNavbar from "../AdminNavbar";

const AdminAddVeterinarian = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    experience: "",
    address: "",
    fee: "",
    about: "",
    category: "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [existingEmails, setExistingEmails] = useState(["test@example.com"]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, photo: file });

    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (existingEmails.includes(formData.email))
      newErrors.email = "Email already registered, use another email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.fee) newErrors.fee = "Fee is required";
    if (!formData.about) newErrors.about = "About is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.photo) newErrors.photo = "Photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Veterinarian added successfully!", formData);
    alert("Veterinarian added successfully!");

    setFormData({
      name: "",
      email: "",
      password: "",
      experience: "",
      address: "",
      fee: "",
      about: "",
      category: "",
      photo: null,
    });
    setPhotoPreview(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminNavbar />

      <div className="flex flex-grow justify-center items-start p-6 mt-10">
        <div className="w-full max-w-4xl bg-white p-8 shadow-xl rounded-lg">
          <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">
            Add Veterinarian
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter years of experience"
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.experience}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category"
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Fee */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Fee
                </label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter consultation fee"
                />
                {errors.fee && (
                  <p className="text-red-500 text-sm mt-1">{errors.fee}</p>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Photo
              </label>
              <label className="file-upload-label">
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
                Upload Photo
              </label>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="mt-4 w-24 h-24 object-cover rounded-lg"
                />
              )}
              {errors.photo && (
                <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Add Veterinarian
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddVeterinarian;
