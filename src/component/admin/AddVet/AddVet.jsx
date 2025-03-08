import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AdminNavbar from "../AdminNavbar";

const AdminAddVeterinarian = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setValue("image", file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("specialization", data.specialization);
      formData.append("experience", data.experience);
      formData.append("bio", data.bio);
      formData.append("fee", data.fee);
      formData.append("image", data.image);

      const response = await fetch("http://localhost:3001/api/veterinarians", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("❌ Error adding veterinarian:", error);
      toast.error("Failed to add veterinarian");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <AdminNavbar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white p-0 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <h2 className="text-3xl font-bold text-white text-center">Add Veterinarian</h2>
            <p className="text-purple-100 text-center mt-2">Enter the details of the new veterinarian</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
            <div className="space-y-2 md:col-span-2 flex flex-col items-center justify-center bg-indigo-50 p-6 rounded-2xl">
              {photoPreview ? (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-40 h-40 rounded-full object-cover border-4 border-indigo-300 shadow-lg" 
                  />
                  <div className="absolute -bottom-3 -right-3 bg-purple-600 rounded-full p-2 shadow-lg">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="w-40 h-40 rounded-full bg-indigo-200 flex items-center justify-center">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </label>
                </div>
              )}
              <input 
                id="file-upload"
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden"
              />
              <p className="text-indigo-600 font-medium">Upload Profile Photo</p>
            </div>

            <div className="relative">
              <input 
                {...register("name")} 
                placeholder="Name" 
                required 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all" 
              />
              <div className="absolute top-3 right-4 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input 
                {...register("email")} 
                placeholder="Email" 
                required 
                type="email" 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all" 
              />
              <div className="absolute top-3 right-4 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input 
                {...register("phone")} 
                placeholder="Phone" 
                required 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all" 
              />
              <div className="absolute top-3 right-4 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input 
                {...register("specialization")} 
                placeholder="Specialization" 
                required 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all" 
              />
              <div className="absolute top-3 right-4 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input 
                {...register("experience")} 
                placeholder="Experience" 
                required 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all" 
              />
              <div className="absolute top-3 right-4 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input 
                {...register("fee")} 
                placeholder="Fee" 
                required 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all" 
              />
              <div className="absolute top-3 right-4 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="md:col-span-2 relative">
              <textarea 
                {...register("bio")} 
                placeholder="Bio" 
                required 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all h-32 resize-none" 
              ></textarea>
              <div className="absolute top-3 right-4 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>

            <div className="md:col-span-2">
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add Veterinarian
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddVeterinarian;