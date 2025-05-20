import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useUserInfo from "../../hooks/userUserInfo";
import NavBar from "../Header/NavBar"
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";


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
    <div className="min-h-screen bg-green-100">
      <div className="flex justify-center items-center">
        <NavBar />
      </div>
      
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-green-200">
          <div className="bg-green-800 p-5">
            <h2 className="text-2xl font-serif font-medium text-white text-center">Edit Profile</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {error && <div className="text-red-500 text-sm font-sans mb-4">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-sans font-medium text-green-900">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                  className="w-full p-3 border border-green-300 rounded-lg bg-green-50 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-sans font-medium text-green-900">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-green-300 rounded-lg bg-green-50 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 font-sans"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-sans font-medium text-green-900">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 transition duration-300 ease-in-out transform hover:-translate-y-1 font-sans font-medium mt-6"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditProfile;