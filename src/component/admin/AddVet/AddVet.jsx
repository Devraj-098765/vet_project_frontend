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
      setValue("photo", file);
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
      formData.append("photo", data.photo);

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminNavbar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-2xl shadow-xl border border-teal-100">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Photo upload */}
            <div className="w-full md:w-1/3 flex flex-col items-center justify-start gap-6">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-tl from-teal-200 to-blue-200 flex items-center justify-center shadow-inner">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-teal-700 text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p>Veterinarian Photo</p>
                  </div>
                )}
              </div>
              
              <label className="w-full cursor-pointer">
                <div className="py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-center transition-all duration-200 shadow-md hover:shadow-lg">
                  Select Photo
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            
            {/* Right side - Form fields */}
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-bold mb-6 text-teal-800 border-b-2 border-teal-200 pb-2">Add Veterinarian</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <label className="block text-sm font-medium text-teal-700 mb-1">Name</label>
                    <input {...register("name")} placeholder="Dr. Abhisek khatri" className="w-full p-3 bg-white/70 backdrop-blur-sm border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" required />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-teal-700 mb-1">Email</label>
                    <input {...register("email")} type="email" placeholder="Abhisekkhatri@vetclinic.com" className="w-full p-3 bg-white/70 backdrop-blur-sm border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" required />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-teal-700 mb-1">Phone</label>
                    <input {...register("phone")} placeholder="(+977)" className="w-full p-3 bg-white/70 backdrop-blur-sm border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" required />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-teal-700 mb-1">Specialization</label>
                    <input {...register("specialization")} placeholder="Feline Medicine" className="w-full p-3 bg-white/70 backdrop-blur-sm border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" required />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-teal-700 mb-1">Experience (years)</label>
                    <input {...register("experience")} placeholder="5" className="w-full p-3 bg-white/70 backdrop-blur-sm border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" required />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-teal-700 mb-1">Fee</label>
                    <input {...register("fee")} placeholder="Consultation fee" className="w-full p-3 bg-white/70 backdrop-blur-sm border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" required />
                  </div>
                  
                  <div className="relative md:col-span-2">
                    <label className="block text-sm font-medium text-teal-700 mb-1">Bio</label>
                    <textarea {...register("bio")} placeholder="Brief professional biography" className="w-full p-3 bg-white/70 backdrop-blur-sm border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition h-24" required></textarea>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button type="submit" className="w-full p-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                    Add Veterinarian
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddVeterinarian;