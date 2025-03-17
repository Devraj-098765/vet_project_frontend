import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useUserInfo from "../../hooks/userUserInfo";
import NavBar from "../Header/NavBar";

const EditProfile = () => {
  const { id } = useParams();
  const { users, handleEditUserInfo, loading, error } = useUserInfo();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // Find the user by ID and set the form data
    const user = users.find((user) => user._id === id);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // Leave password empty for security reasons
      });
    }
  }, [id, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditUserInfo(id, formData);
  };

  return (
    
    <div className="flex justify-center items-center">
        <NavBar />
      
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange}
            name="name"
            className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
    </div>
  );
};

export default EditProfile;
