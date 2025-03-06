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
    bio: "",
    category: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setErrors({ ...errors, photo: "Only PNG/JPEG images allowed" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, photo: "File size must be < 5MB" });
      return;
    }
    setFormData({ ...formData, photo: file });
    setErrors({ ...errors, photo: null });
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (formData.password.length < 6) newErrors.password = "Password too short";
    if (!formData.experience || formData.experience < 0) newErrors.experience = "Valid experience required";
    if (!formData.address.trim()) newErrors.address = "Address required";
    if (!formData.fee || formData.fee < 0) newErrors.fee = "Valid fee required";
    if (!formData.bio.trim()) newErrors.bio = "Bio required";
    if (!formData.category.trim()) newErrors.category = "Category required";
    if (!formData.photo) newErrors.photo = "Profile photo required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert("Veterinarian added successfully!");
    setFormData({
      name: "",
      email: "",
      password: "",
      experience: "",
      address: "",
      fee: "",
      bio: "",
      category: "",
      photo: null,
    });
    setPhotoPreview(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNavbar />
      <div className="flex-grow p-6 mt-10 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b pb-4">
            New Veterinarian
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
              <InputField label="Email" name="email" value={formData.email} onChange={handleChange} error={errors.email} type="email" />
              <InputField label="Password" name="password" value={formData.password} onChange={handleChange} error={errors.password} type="password" />
              <InputField label="Experience (Years)" name="experience" value={formData.experience} onChange={handleChange} error={errors.experience} type="number" min="0" />
              <InputField label="Category (Specialty)" name="category" value={formData.category} onChange={handleChange} error={errors.category} placeholder="Eg: Surgery" />
              <InputField label="Consultation Fee ($)" name="fee" value={formData.fee} onChange={handleChange} error={errors.fee} type="number" min="0" step="0.01" />
            </div>
            <InputField label="Clinic Address" name="address" value={formData.address} onChange={handleChange} error={errors.address} textarea />
            <InputField label="Professional Bio" name="bio" value={formData.bio} onChange={handleChange} error={errors.bio} textarea />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              <input type="file" accept="image/png, image/jpeg" onChange={handlePhotoChange} className="block w-full text-sm" />
              {photoPreview && <img src={photoPreview} alt="Preview" className="w-20 h-20 mt-2 rounded-full border" />}
              {errors.photo && <ErrorText message={errors.photo} />}
            </div>
            <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isSubmitting ? "Registering..." : "Register Veterinarian"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, error, type = "text", textarea = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {textarea ? (
      <textarea name={name} value={value} onChange={onChange} className={`w-full px-4 py-2 text-sm border rounded-lg ${error ? 'border-red-500' : ''}`} {...props} />
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} className={`w-full px-4 py-2 text-sm border rounded-lg ${error ? 'border-red-500' : ''}`} {...props} />
    )}
    {error && <ErrorText message={error} />}
  </div>
);

const ErrorText = ({ message }) => <p className="text-red-500 text-xs italic mt-1">{message}</p>;

export default AdminAddVeterinarian;
