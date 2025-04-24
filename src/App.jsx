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
import RouteErrorBoundary from "./utils/RouteErrorBoundary.jsx";
import NotFound from "./utils/NotFound.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Outlet />,
      errorElement: <RouteErrorBoundary />,
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
        // Catch-all for undefined paths within the main layout
        {
          path: "*",
          element: <NotFound />
        }
      ],
    },
    {
      path: "/sign-up",
      element: <Signup />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPasswordConfirmation />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/admin",
      element: <Admin />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/adminDashboard",
      element: (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      ),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/appointments",
      element: (
        <ProtectedRoute>
          <AdminAppointments />
        </ProtectedRoute>
      ),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/UserList",
      element: <UserList />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/AddVet",
      element: <AddVet />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/admin/veterinarianlist",
      element: (
        <ProtectedRoute>
          <VeterinarianList />
        </ProtectedRoute>
      ),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/VeterinarianDashboard",
      element: (
        <ProtectedRoute>
          <VeterinarianDashboard />
        </ProtectedRoute>
      ),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/Totalappointment",
      element: (
        <ProtectedRoute>
          <TotalAppointment />
        </ProtectedRoute>
      ),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/booking-report/:bookingId",
      element: (
        <ProtectedRoute>
          <MakeReport />
        </ProtectedRoute>
      ),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/veterinarian-reports",
      element: (
        <ProtectedRoute>
          <VeterinarianReports />
        </ProtectedRoute>
      ),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/blog",
      element: (
        <ProtectedRoute>
          <Blog />
        </ProtectedRoute>
      ),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/Profile",
      element: <Profile />,
      errorElement: <RouteErrorBoundary />,
    },
    // Global catch-all for any unmatched routes
    {
      path: "*",
      element: <NotFound />,
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;