import React from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import IndexPage from "./component/Index/IndexPage";
import AboutUs from "./component/About/About";
import Consultation from "./component/Consultation/Consultation";
import Footer from "./component/Footer/Footer";
import Contact from "./utils/Contact";
import { UserBlogPage, BlogDetail } from "./component/UserBlog.jsx";
import Admin from "./pages/auth/Admin";
import AdminDashboard from "./component/admin/AdminDashboard";
import UserList from "./component/admin/Userlist/UserList";
import AddVet from "./component/admin/AddVet/AddVet.jsx";
import AdminNavbar from "./component/admin/AdminNavbar.jsx";
import VeterinarianList from "./component/admin/AddVet/VeterinarianList.jsx";
import UserVeterinarianList from "./component/UserVeterinarian/UserVeterinarianList.jsx";
import EditProfile from "./component/EditProfile/EditProfile.jsx";
import BookingSystem from "./component/Bookingsytem.jsx";
import AppointmentHistory from "./component/AppointmentHistory/AppointmentHistory.jsx";
import AdminAppointments from "./component/admin/AdminAppointment/AdminAppointment.jsx";
import VeterinarianDashboard from "../Veterinarian/VeterinarianDash/VeterinarianDashboard.jsx";
import TotalAppointment from "../Veterinarian/TotalAppointment/TotalAppointment.jsx";
import Profile from "../Veterinarian/Profile.jsx";
import MakeReport from "../Veterinarian/MakeReport.jsx";
import VeterinarianReports from "../Veterinarian/VeterinarianReports.jsx";
import MyReportCard from "./pages/MyReportCard.jsx";
import Blog from "../Veterinarian/Blog.jsx";
import ResetPasswordConfirmation from "./pages/auth/ResetPasswordConfirmation.jsx";
import VetLocationMap from "./component/VetMap/VetLocationMap.jsx";
import AllNotifications from "./component/Notifications/AllNotifications.jsx";
import PaymentHistory from "./component/Payment/PaymentHistory";
import PaymentReceipt from "./component/Payment/PaymentReceipt";
import AdminPayments from "./component/admin/AdminPayments";
import AdminActivities from "./component/admin/AdminActivities";
import Earning from "../Veterinarian/Earning.jsx";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Outlet />,
    
      children: [
        {
          path: "/",
          element: <IndexPage />,
        },
        {
          path: "/about-us",
          element: <AboutUs />,
        },
        {
          path: "/consultation",
          element: <Consultation />,
        },
        {
          path: "/user/veterinarians",
          element: <UserVeterinarianList />,
        },
        {
          path: "/find-nearby-vets",
          element: <VetLocationMap />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/footer",
          element: <Footer />,
        },
        {
          path: "/blogs",
          element: <UserBlogPage />  
        },
        {
          path: "/blogs/:id",
          element: <BlogDetail />  
        },
        // Redirect from old blog path to the new one
        {
          path: "/userblog",
          element: <Navigate to="/blogs" replace />
        },
        {
          path: "/bookingsystem",
          element: (
            <ProtectedRoute>
              <BookingSystem />
            </ProtectedRoute>
          ),
        },
        {
          path: "/editprofile/:id",
          element: <EditProfile />,
        },

        
        {
          path: "/appointments", 
          element: (
            <ProtectedRoute>
              <AppointmentHistory />
            </ProtectedRoute>
          ),
        },
        
        // Keep the old route for backward compatibility
        {
          path: "/appointmenthistory/:id",
          element: (
            <ProtectedRoute>
              <AppointmentHistory />
            </ProtectedRoute>
          ),
        },
        {
          path: "/my-report-card",
          element: (
            <ProtectedRoute>
              <MyReportCard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/payments/history",
          element: (
            <ProtectedRoute>
              <PaymentHistory />
            </ProtectedRoute>
          ),
        },
        {
          path: "/payments/:id",
          element: (
            <ProtectedRoute>
              <PaymentReceipt />
            </ProtectedRoute>
          ),
        },
        
      ],
    },
    {
      path: "/sign-up",
      element: <Signup />,
      
    },
    {
      path: "/login",
      element: <Login />,
 
    },
    {
      path: "/reset-password/:token",
      element: <ResetPasswordConfirmation />,
      
    },
    {
      path: "/admin",
      element: <Admin />,
     
    },
    {
      path: "/adminDashboard",
      element: (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      ),
  
    },
    // Remove duplicate /appointments route
    {
      path: "/UserList",
      element: (
         <ProtectedRoute>
      <UserList />,
        </ProtectedRoute>
      ),
     
    },
    {
      path: "/AddVet",
      element:( 
      <ProtectedRoute>
      <AddVet />,
        </ProtectedRoute>
      ),
    },
    {
      path: "/adminAppointment",
      element: (
        <ProtectedRoute>
          <AdminAppointments />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/veterinarianlist",
      element: (
        <ProtectedRoute>
          <VeterinarianList />
        </ProtectedRoute>
      ),
     
    },
    {
      path: "/VeterinarianDashboard",
      element: (
        <ProtectedRoute>
          <VeterinarianDashboard />
        </ProtectedRoute>
      ),
     
    },
    {
      path: "/Totalappointment",
      element: (
        <ProtectedRoute>
          <TotalAppointment />
        </ProtectedRoute>
      ),
   
    },
    {
      path: "/booking-report/:bookingId",
      element: (
        <ProtectedRoute>
          <MakeReport />
        </ProtectedRoute>
      ),
      
    },
    {
      path: "/veterinarian-reports",
      element: (
        <ProtectedRoute>
          <VeterinarianReports />
        </ProtectedRoute>
      ),
      
    },
    {
      path: "/blog",
      element: (
        <ProtectedRoute>
          <Blog />
        </ProtectedRoute>
      ),
  
    },
    {
      path: "/Profile",
      element: <Profile />,
      
    },
    {
      path: "/all-notifications",
      element: (
        <ProtectedRoute>
          <AllNotifications />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/payments",
      element: (
        <ProtectedRoute>
          <AdminPayments />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/activities",
      element: (
        <ProtectedRoute>
          <AdminActivities />
        </ProtectedRoute>
      ),
    },
    {
      path: "/earning",
      element: (
        <ProtectedRoute>
          <Earning />
        </ProtectedRoute>
      ),
    },
   
  ]);

  return <RouterProvider router={router} />;
}

export default App;