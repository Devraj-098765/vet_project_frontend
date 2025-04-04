import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import MainLayout from "./component/MainLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import IndexPage from "./component/Index/IndexPage";
import AboutUs from "./component/About/About";
import Report from "./component/Report/Report.jsx"
import Consultation from "./component/Consultation/Consultation";
import Footer from "./component/Footer/Footer";
import Contact from "./utils/Contact";
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
import MakeReport from "../Veterinarian/MakeReport.jsx";
import Profile from "../Veterinarian/Profile.jsx"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Outlet /> {/* Renders the child routes */}
        </>
      ),
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
          path:"/report",
          element: <Report/>
         },
        {
          path: "/consultation",
          element: <Consultation />,
        },
        {
          path: "/user/veterinarians",
          element: <UserVeterinarianList/>

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
          path: "/bookingsystem",
          element: (
            <ProtectedRoute>
              <BookingSystem />
            </ProtectedRoute>
          )
        },
        {
          path: "/editprofile/:id",
          element:<EditProfile/>

        },
        {
          path: "/appointmenthistory/:id",
          element: (
            <ProtectedRoute>
              <AppointmentHistory />
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
    {
      path: "/appointments", 
      element: (
        <ProtectedRoute>
          <AdminAppointments />
        </ProtectedRoute>
      )
    },
    
    {
      path: "/UserList",
      element: <UserList />
    },
    {
      path: "/AddVet",
      element: <AddVet />
    },
   {
    
    path: "/admin/veterinarianlist",
    element:(
     < ProtectedRoute>
     <VeterinarianList />
     </ProtectedRoute>
    )
   },

   {
    path: "/VeterinarianDashboard",
    element:( 
      <ProtectedRoute>
    <VeterinarianDashboard/>
    </ProtectedRoute>
    )
   },
   {
    path:"/Totalappointment",
    element:(
      <ProtectedRoute>
    <TotalAppointment/>
    </ProtectedRoute>
    )
   },
   {
    path: "/MakeReport",
    element:<MakeReport/>
   },
   {
    path: "/Profile",
    element:<Profile/>
   }
  
  ]);

  

  return <RouterProvider router={router} />;
}

export default App;

