// App.jsx
import {Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp";
import AdminDashboard from "./components/AdminDashboard";


function OrganizerDashboard() {
  return <h2>Welcome Organizer Dashboard</h2>;
}
function StudentDashboard() {
  return <h2>Welcome Student Dashboard</h2>;
}

function App() {
  const [role, setRole] = useState("");
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<SignIn setRole={setRole} />} />
      {/*Sign UP Route*/}
      <Route path="/signup" element={<SignUp />} />
      {/* Role-based dashboards */}
      <Route
        path="/admin-dashboard/*"
        element={role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/event_organizer-dashboard"
        element={role === "event_organizer" ? <OrganizerDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/student-dashboard"
        element={role === "student" ? <StudentDashboard /> : <Navigate to="/" />}
      />
    </Routes>
   
  );
}

export default App;
