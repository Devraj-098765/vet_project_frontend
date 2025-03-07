import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


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
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Add Veterinarian</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("name")} placeholder="Name" className="w-full p-2 border rounded" required />
        <input {...register("email")} placeholder="Email" className="w-full p-2 border rounded" required />
        <input {...register("phone")} placeholder="Phone" className="w-full p-2 border rounded" required />
        <input {...register("specialization")} placeholder="Specialization" className="w-full p-2 border rounded" required />
        <input {...register("experience")} placeholder="Experience" className="w-full p-2 border rounded" required />

        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
        {photoPreview && <img src={photoPreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}

        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Add Veterinarian
        </button>
      </form>
    </div>
  );
};

export default AdminAddVeterinarian;
