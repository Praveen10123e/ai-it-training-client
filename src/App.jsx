import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Quiz from "./pages/Quiz";
import AdminDashboard from "./pages/AdminDashboard";
import Certificate from "./pages/Certificate";
import Register from "./pages/Register";



function Layout() {
  const location = useLocation();

  // Hide Navbar on login page
  const hideNavbar =
  location.pathname === "/" || location.pathname === "/register";


  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<Course />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/cert" element={<Certificate />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />


      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
