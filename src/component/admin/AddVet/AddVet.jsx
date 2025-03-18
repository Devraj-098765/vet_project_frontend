import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AdminNavbar from "../AdminNavbar";

const AdminAddVeterinarian = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
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
      formData.append("password", data.password);
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
      console.error("Error adding veterinarian:", error);
      toast.error("Failed to add veterinarian");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-50 via-cyan-50 to-sky-50">
      <AdminNavbar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-sky-100">
          <div className="bg-gradient-to-r from-blue-500 to-sky-400 p-10 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-16 -mr-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -mb-12 -ml-12"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full"></div>
            <h2 className="text-4xl font-bold text-white text-center relative z-10">Add Veterinarian</h2>
            <p className="text-blue-100 text-center mt-2 relative z-10">Add a skilled veterinary professional to your team</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-10">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Left side - Photo upload */}
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="w-52 h-52 rounded-full bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center mb-6 border-4 border-sky-200 overflow-hidden shadow-lg p-1">
                  {photoPreview ? (
                    <img src={photoPreview} className="w-full h-full object-cover rounded-full" alt="Preview" />
                  ) : (
                    <div className="text-center p-6">
                      <svg className="w-16 h-16 text-blue-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="text-blue-400 mt-4 font-medium">Profile Photo</p>
                    </div>
                  )}
                </div>
                <label className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full cursor-pointer transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path>
                  </svg>
                  Upload Image
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              
              {/* Right side - Form fields */}
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group relative">
                    <input 
                      {...register("name", { required: "Name is required" })} 
                      placeholder=" " 
                      className="w-full px-5 py-4 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none transition-all duration-300 bg-blue-50 bg-opacity-30 hover:bg-opacity-50"
                    />
                    <label className="absolute left-5 top-4 text-blue-400 transition-all duration-300 pointer-events-none group-focus-within:text-blue-600 group-focus-within:-translate-y-7 group-focus-within:text-sm">Name</label>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div className="group relative">
                    <input 
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Please enter a valid email"
                        }
                      })} 
                      placeholder=" " 
                      type="email" 
                      className="w-full px-5 py-4 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none transition-all duration-300 bg-blue-50 bg-opacity-30 hover:bg-opacity-50"
                    />
                    <label className="absolute left-5 top-4 text-blue-400 transition-all duration-300 pointer-events-none group-focus-within:text-blue-600 group-focus-within:-translate-y-7 group-focus-within:text-sm">Email</label>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  
                  <div className="group relative">
                    <input 
                      {...register("phone", { required: "Phone is required" })} 
                      placeholder=" " 
                      className="w-full px-5 py-4 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none transition-all duration-300 bg-blue-50 bg-opacity-30 hover:bg-opacity-50"
                    />
                    <label className="absolute left-5 top-4 text-blue-400 transition-all duration-300 pointer-events-none group-focus-within:text-blue-600 group-focus-within:-translate-y-7 group-focus-within:text-sm">Phone</label>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                  
                  <div className="group relative">
                    <input 
                      {...register("specialization", { required: "Specialization is required" })} 
                      placeholder=" " 
                      className="w-full px-5 py-4 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none transition-all duration-300 bg-blue-50 bg-opacity-30 hover:bg-opacity-50"
                    />
                    <label className="absolute left-5 top-4 text-blue-400 transition-all duration-300 pointer-events-none group-focus-within:text-blue-600 group-focus-within:-translate-y-7 group-focus-within:text-sm">Specialization</label>
                    {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>}
                  </div>
                  
                  <div className="group relative">
                    <input 
                      {...register("experience", { 
                        required: "Experience is required",
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "Experience cannot be negative"
                        }
                      })} 
                      placeholder=" " 
                      type="number"
                      min="0"
                      className="w-full px-5 py-4 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none transition-all duration-300 bg-blue-50 bg-opacity-30 hover:bg-opacity-50"
                    />
                    <label className="absolute left-5 top-4 text-blue-400 transition-all duration-300 pointer-events-none group-focus-within:text-blue-600 group-focus-within:-translate-y-7 group-focus-within:text-sm">Experience (Years)</label>
                    {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
                  </div>
                  
                  <div className="group relative">
                    <input 
                      {...register("fee", { 
                        required: "Fee is required",
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "Fee cannot be negative"
                        }
                      })} 
                      placeholder=" " 
                      type="number" 
                      min="0"
                      className="w-full px-5 py-4 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none transition-all duration-300 bg-blue-50 bg-opacity-30 hover:bg-opacity-50"
                    />
                    <label className="absolute left-5 top-4 text-blue-400 transition-all duration-300 pointer-events-none group-focus-within:text-blue-600 group-focus-within:-translate-y-7 group-focus-within:text-sm">Fee</label>
                    {errors.fee && <p className="text-red-500 text-sm mt-1">{errors.fee.message}</p>}
                  </div>
                  
                  <div className="group relative">
                    <input 
                      {...register("password", { 
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })} 
                      placeholder=" " 
                      type="password" 
                      className="w-full px-5 py-4 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none transition-all duration-300 bg-blue-50 bg-opacity-30 hover:bg-opacity-50"
                    />
                    <label className="absolute left-5 top-4 text-blue-400 transition-all duration-300 pointer-events-none group-focus-within:text-blue-600 group-focus-within:-translate-y-7 group-focus-within:text-sm">Password</label>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  </div>
                  
                  <div className="group relative col-span-2">
                    <textarea 
                      {...register("bio", { required: "Bio is required" })} 
                      placeholder=" " 
                      rows="4" 
                      className="w-full px-5 py-4 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none transition-all duration-300 bg-blue-50 bg-opacity-30 hover:bg-opacity-50"
                    ></textarea>
                    <label className="absolute left-5 top-4 text-blue-400 transition-all duration-300 pointer-events-none group-focus-within:text-blue-600 group-focus-within:-translate-y-7 group-focus-within:text-sm">Bio</label>
                    {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
                  </div>
                </div>
                
                <div className="mt-10 flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white px-10 py-4 rounded-xl shadow-lg hover:shadow-blue-200/50 hover:shadow-2xl transition-all duration-300 font-medium flex items-center"
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    Add Veterinarian
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddVeterinarian;