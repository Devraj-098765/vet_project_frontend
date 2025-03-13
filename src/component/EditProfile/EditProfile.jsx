import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "react-toastify";

// Validation schema
const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string().refine((val) => new Date(val) < new Date(), "Invalid date"),
});

const EditProfile = () => {
  const [user, setUser] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        setValue("gender", data.gender || "Male");
        setValue("dob", data.dob ? data.dob.split("T")[0] : "");
      } catch (error) {
        toast.error("Failed to load user data");
      }
    };
    fetchUser();
  }, [setValue]);

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/users/update",
        { password: formData.password, gender: formData.gender, dob: formData.dob },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Edit Profile</h2>

      {/* Name (Non-editable) */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={user.name}
          disabled
          className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Email (Non-editable) */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Form for updating other fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Password */}
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full mt-1 p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select {...register("gender")} className="w-full mt-1 p-2 border rounded">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <input type="date" {...register("dob")} className="w-full mt-1 p-2 border rounded" />
          {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
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
  );
};

export default EditProfile;
