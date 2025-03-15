import { useState, useEffect } from "react";
import { AlertCircle, Calendar, Clock, Phone, User, CheckCircle, Loader2 } from "lucide-react";
import NavBar from "./Header/NavBar"; 
import useAuth from "../hooks/useAuth";

const BookingSystem = () => {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    petName: "",
    petType: "",
    petAge: "",
    service: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("email").split("@")[0];
    
    if (userEmail) {
      setFormData((prevData) => ({ ...prevData, name: userEmail }));
    }
  }, []);

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
  ];

  const services = [
    "Routine Check-up",
    "Vaccination",
    "Surgery Consultation",
    "Emergency Care",
    "Behavioral Consultation",
  ];

  const petTypes = ["Dog", "Cat", "Bird", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[()-\s]/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time slot is required";
    if (!formData.petName.trim()) newErrors.petName = "Pet name is required";
    if (!formData.petType) newErrors.petType = "Pet type is required";
    if (!formData.petAge.trim()) newErrors.petAge = "Pet age is required";
    if (!formData.service) newErrors.service = "Service is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Clear previous form-level errors

    try {
      const response = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to book appointment");
      }

      await response.json();
      setSuccess(true);
      setFormData({
        name: auth?.name || auth?.email || "",
        phone: "",
        date: "",
        time: "",
        petName: "",
        petType: "",
        petAge: "",
        service: "",
        notes: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Booking Error:", error);
      setErrors({ form: error.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Book a Veterinarian Appointment</h2>

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center space-x-2">
            <CheckCircle size={20} />
            <span>Appointment booked successfully! We'll contact you to confirm.</span>
          </div>
        )}

        {errors.form && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle size={20} />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                readOnly
                className="w-full p-2 pl-10 border rounded border-gray-300 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="(XXX) XXX-XXXX"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2 pl-10 border rounded ${errors.phone ? "border-red-500" : "border-gray-300"}`}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Preferred Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  id="date"
                  type="date"
                  name="date"
                  min={getTodayDate()}
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full p-2 pl-10 border rounded ${errors.date ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Preferred Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full p-2 pl-10 border rounded ${errors.time ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Time Slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              {errors.time && <p className="text-red-500 text-xs">{errors.time}</p>}
            </div>
          </div>

          {/* Pet Details */}
          <div className="space-y-2">
            <label htmlFor="petName" className="block text-sm font-medium text-gray-700">Pet Name</label>
            <input
              id="petName"
              type="text"
              name="petName"
              value={formData.petName}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.petName ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.petName && <p className="text-red-500 text-xs">{errors.petName}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="petType" className="block text-sm font-medium text-gray-700">Pet Type</label>
              <select
                id="petType"
                name="petType"
                value={formData.petType}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.petType ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select Pet Type</option>
                {petTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.petType && <p className="text-red-500 text-xs">{errors.petType}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="petAge" className="block text-sm font-medium text-gray-700">Pet Age</label>
              <input
                id="petAge"
                type="text"
                name="petAge"
                value={formData.petAge}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.petAge ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.petAge && <p className="text-red-500 text-xs">{errors.petAge}</p>}
            </div>
          </div>

          {/* Service */}
          <div className="space-y-2">
            <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.service ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
            {errors.service && <p className="text-red-500 text-xs">{errors.service}</p>}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300"
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded flex justify-center items-center disabled:bg-blue-400"
          >
            {loading ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingSystem;