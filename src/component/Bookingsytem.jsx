import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AlertCircle, Calendar, Clock, Phone, User, CheckCircle, Loader2 } from "lucide-react";
import NavBar from "../component/Header/NavBar.jsx";
import useAuth from "../hooks/useAuth";
import Footer from "./Footer/Footer";
import axiosInstance from "../api/axios.js";

const BookingSystem = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const vet = location.state?.vet; // Get vet data from navigation

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
    veterinarianId: vet?._id || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("vetapp-email")?.split("@")[0];
    if (userEmail) {
      setFormData((prevData) => ({ ...prevData, name: userEmail, veterinarianId: vet?._id || "" }));
    }
    console.log(userEmail)
  }, [vet]);

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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
    if (!formData.veterinarianId) newErrors.veterinarianId = "Veterinarian selection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await axiosInstance.post("/bookings", formData);
      console.log("Booking Response:", response.data);
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
        veterinarianId: vet?._id || "",
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Booking Error:", error.response ? error.response.data : error.message);
      setErrors({
        form: error.response?.data?.error || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="flex justify-center items-center">
        <NavBar />
      </div>
      
      <div className="max-w-2xl mx-auto p-6 my-8">
        <div className="bg-white rounded-xl overflow-hidden shadow-lg border-l-4 border-green-700">
          <div className="h-8 bg-gradient-to-r from-green-800 to-green-600"></div>
          
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center -mt-12 border-4 border-white shadow-md">
                <Calendar size={24} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-green-800 mb-1">Veterinary Appointment</h2>
            <p className="text-center text-green-600 mb-6 text-sm">
              Scheduling with Dr. {vet?.name || "Unknown"}
            </p>

            {success && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center border-l-4 border-green-500">
                <CheckCircle size={20} className="mr-2 text-green-500" />
                <span>Appointment booked successfully! We'll contact you to confirm.</span>
              </div>
            )}

            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center border-l-4 border-red-500">
                <AlertCircle size={20} className="mr-2 text-red-500" />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-green-700 mb-1 flex items-center">
                    <User size={14} className="mr-1 text-green-600" />
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    readOnly
                    className="w-full p-2 rounded-lg bg-green-50/70 shadow-inner cursor-not-allowed text-green-700"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-green-700 mb-1 flex items-center">
                    <Phone size={14} className="mr-1 text-green-600" />
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="(XXX) XXX-XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-2 rounded-lg shadow-inner ${
                      errors.phone ? "ring-1 ring-red-500" : "border-green-200"
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-green-700 mb-1 flex items-center">
                    <Calendar size={14} className="mr-1 text-green-600" />
                    Preferred Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    min={getTodayDate()}
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full p-2 rounded-lg ${
                      errors.date ? "ring-1 ring-red-500" : ""
                    }`}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-green-700 mb-1 flex items-center">
                    <Clock size={14} className="mr-1 text-green-600" />
                    Preferred Time
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`w-full p-2 rounded-lg ${
                      errors.time ? "ring-1 ring-red-500" : ""
                    }`}
                  >
                    <option value="">Select Time Slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>
              </div>

              <div className="bg-green-50/70 p-4 rounded-lg border-l-4 border-green-600">
                <h3 className="text-green-800 font-medium mb-3">Pet Information</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="petName" className="block text-sm font-medium text-green-700 mb-1">Pet Name</label>
                    <input
                      id="petName"
                      type="text"
                      name="petName"
                      value={formData.petName}
                      onChange={handleChange}
                      className={`w-full p-2 rounded-lg ${
                        errors.petName ? "ring-1 ring-red-500" : ""
                      }`}
                    />
                    {errors.petName && <p className="text-red-500 text-xs mt-1">{errors.petName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="petType" className="block text-sm font-medium text-green-700 mb-1">Pet Type</label>
                      <select
                        id="petType"
                        name="petType"
                        value={formData.petType}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-lg ${
                          errors.petType ? "ring-1 ring-red-500" : ""
                        }`}
                      >
                        <option value="">Select Pet Type</option>
                        {petTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.petType && <p className="text-red-500 text-xs mt-1">{errors.petType}</p>}
                    </div>
                    <div>
                      <label htmlFor="petAge" className="block text-sm font-medium text-green-700 mb-1">Pet Age</label>
                      <input
                        id="petAge"
                        type="text"
                        name="petAge"
                        value={formData.petAge}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-lg ${
                          errors.petAge ? "ring-1 ring-red-500" : ""
                        }`}
                      />
                      {errors.petAge && <p className="text-red-500 text-xs mt-1">{errors.petAge}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-green-700 mb-2">Service Required</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {services.map((service) => (
                    <label 
                      key={service} 
                      className={`flex items-center p-2 rounded-lg cursor-pointer ${
                        formData.service === service 
                          ? "bg-green-700 text-white" 
                          : "bg-white hover:bg-green-50 border border-green-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service}
                        checked={formData.service === service}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-sm">{service}</span>
                    </label>
                  ))}
                </div>
                {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-green-700 mb-1">Additional Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border-green-200"
                  rows="3"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white p-2 rounded-lg flex justify-center items-center disabled:bg-green-400 transition duration-300"
              >
                {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                {loading ? "Booking..." : "Book Appointment"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingSystem;