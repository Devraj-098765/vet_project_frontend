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
    <div className="flex h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-800">
      <AdminNavbar />
      <div className="flex-1 p-6 overflow-auto bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] bg-repeat">
        <div className="max-w-5xl mx-auto bg-purple-950/70 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-purple-600/20">
          <div className="bg-gradient-to-r from-purple-950 to-purple-900 p-8 relative overflow-hidden border-b border-purple-700/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h2 className="text-4xl font-serif font-bold text-purple-100 tracking-tight">Add Veterinarian</h2>
                <p className="text-purple-300 mt-2 font-light">Expand your premium medical team</p>
              </div>
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-800 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/50 border border-purple-600/50">
                <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-purple-800/5 z-0"></div>
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              {/* Left side - Photo upload */}
              <div className="md:w-1/3">
                <div className="bg-purple-900/50 p-6 rounded-xl border border-purple-700/50 shadow-xl shadow-purple-950/30">
                  <h3 className="text-lg font-serif font-medium text-purple-200 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Profile Image
                  </h3>
                  <div className="aspect-square mb-6 bg-purple-900/60 border border-purple-600/30 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                    {photoPreview ? (
                      <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-24 h-24 bg-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-600/30">
                          <svg className="w-12 h-12 text-purple-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <p className="text-purple-300 text-sm font-light">Upload profile photo</p>
                        <p className="text-purple-400/40 text-xs mt-2">Premium quality recommended</p>
                      </div>
                    )}
                  </div>
                  <label className="bg-gradient-to-r from-purple-800 to-purple-700 hover:from-purple-700 hover:to-purple-600 text-purple-200 w-full py-3 rounded-lg text-center cursor-pointer transition-all duration-300 inline-block text-sm font-medium shadow-lg shadow-purple-950/50 group border border-purple-600/50">
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path>
                      </svg>
                      Select Image
                    </span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
              
              {/* Right side - Form fields */}
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-purple-900/50 p-5 rounded-xl border border-purple-700/40 shadow-lg hover:shadow-purple-800/20 transition-all duration-300 transform hover:-translate-y-1">
                    <label className="block text-purple-300 text-sm font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Name
                    </label>
                    <input 
                      {...register("name", { required: "Name is required" })} 
                      className="w-full px-4 py-3 rounded-lg bg-purple-950/70 border border-purple-700/50 text-purple-200 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                      placeholder="Full Name"
                    />
                    {errors.name && <p className="text-pink-300 text-xs mt-1 flex items-center"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>{errors.name.message}</p>}
                  </div>
                  
                  <div className="bg-purple-900/50 p-5 rounded-xl border border-purple-700/40 shadow-lg hover:shadow-purple-800/20 transition-all duration-300 transform hover:-translate-y-1">
                    <label className="block text-purple-300 text-sm font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      Email
                    </label>
                    <input 
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Please enter a valid email"
                        }
                      })} 
                      type="email" 
                      className="w-full px-4 py-3 rounded-lg bg-purple-950/70 border border-purple-700/50 text-purple-200 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                    {errors.email && <p className="text-pink-300 text-xs mt-1 flex items-center"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>{errors.email.message}</p>}
                  </div>
                  
                  <div className="bg-purple-900/50 p-5 rounded-xl border border-purple-700/40 shadow-lg hover:shadow-purple-800/20 transition-all duration-300 transform hover:-translate-y-1">
                    <label className="block text-purple-300 text-sm font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      Phone
                    </label>
                    <input 
                      {...register("phone", { required: "Phone is required" })} 
                      className="w-full px-4 py-3 rounded-lg bg-purple-950/70 border border-purple-700/50 text-purple-200 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                      placeholder="(123) 456-7890"
                    />
                    {errors.phone && <p className="text-pink-300 text-xs mt-1 flex items-center"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>{errors.phone.message}</p>}
                  </div>
                  
                  <div className="bg-purple-900/50 p-5 rounded-xl border border-purple-700/40 shadow-lg hover:shadow-purple-800/20 transition-all duration-300 transform hover:-translate-y-1">
                    <label className="block text-purple-300 text-sm font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                      </svg>
                      Specialization
                    </label>
                    <input 
                      {...register("specialization", { required: "Specialization is required" })} 
                      className="w-full px-4 py-3 rounded-lg bg-purple-950/70 border border-purple-700/50 text-purple-200 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                      placeholder="e.g. Small Animals, Surgery"
                    />
                    {errors.specialization && <p className="text-pink-300 text-xs mt-1 flex items-center"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>{errors.specialization.message}</p>}
                  </div>
                  
                  <div className="bg-purple-900/50 p-5 rounded-xl border border-purple-700/40 shadow-lg hover:shadow-purple-800/20 transition-all duration-300 transform hover:-translate-y-1">
                    <label className="block text-purple-300 text-sm font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Experience (Years)
                    </label>
                    <input 
                      {...register("experience", { 
                        required: "Experience is required",
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "Experience cannot be negative"
                        }
                      })} 
                      type="number"
                      min="0"
                      className="w-full px-4 py-3 rounded-lg bg-purple-950/70 border border-purple-700/50 text-purple-200 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                      placeholder="0"
                    />
                    {errors.experience && <p className="text-pink-300 text-xs mt-1 flex items-center"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>{errors.experience.message}</p>}
                  </div>
                  
                  <div className="bg-purple-900/50 p-5 rounded-xl border border-purple-700/40 shadow-lg hover:shadow-purple-800/20 transition-all duration-300 transform hover:-translate-y-1">
                    <label className="block text-purple-300 text-sm font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Fee
                    </label>
                    <input 
                      {...register("fee", { 
                        required: "Fee is required",
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "Fee cannot be negative"
                        }
                      })} 
                      type="number" 
                      min="0"
                      className="w-full px-4 py-3 rounded-lg bg-purple-950/70 border border-purple-700/50 text-purple-200 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                      placeholder="0.00"
                    />
                    {errors.fee && <p className="text-pink-300 text-xs mt-1 flex items-center"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>{errors.fee.message}</p>}
                  </div>
                  
                  <div className="bg-purple-900/50 p-5 rounded-xl border border-purple-700/40 shadow-lg hover:shadow-purple-800/20 transition-all duration-300 transform hover:-translate-y-1">
                    <label className="block text-purple-300 text-sm font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      Password
                    </label>
                    <input 
                      {...register("password", { 
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })} 
                      type="password" 
                      className="w-full px-4 py-3 rounded-lg bg-purple-950/70 border border-purple-700/50 text-purple-200 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    {errors.password && <p className="text-pink-300 text-xs mt-1 flex items-center"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>{errors.password.message}</p>}
                  </div>
                  
                  <div className="bg-purple-900/50 p-5 rounded-xl border border-purple-700/40 shadow-lg hover:shadow-purple-800/20 transition-all duration-300 transform hover:-translate-y-1 col-span-2">
                    <label className="text-purple-300 text-sm font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7"></path>
                      </svg>
                      Bio
                    </label>
                    <textarea 
                      {...register("bio", { required: "Bio is required" })} 
                      rows="4" 
                      className="w-full px-4 py-3 rounded-lg bg-purple-950/70 border border-purple-700/50 text-purple-200 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                      placeholder="Write a short bio..."
                    ></textarea>
                    {errors.bio && <p className="text-pink-300 text-xs mt-1 flex items-center"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>{errors.bio.message}</p>}
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-purple-800 to-purple-700 hover:from-purple-700 hover:to-purple-600 text-purple-200 px-10 py-3 rounded-lg shadow-lg shadow-purple-950/50 transition-all duration-300 font-medium flex items-center transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/30 border border-purple-600/50"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
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