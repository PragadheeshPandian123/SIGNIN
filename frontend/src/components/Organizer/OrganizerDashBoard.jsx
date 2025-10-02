// src/components/Organizer/OrganizerDashboard.jsx
import { Link, Routes, Route, Navigate } from "react-router-dom";
import MyEvents from "./MyEvents";
import AddEvents from "./AddEvents";
import ViewVenues from "./ViewVenues";

const OrganizerDashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Left Sidebar */}
      <nav
        style={{
          width: "220px",
          background: "#f0f0f0",
          padding: "20px",
          height: "100vh",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link to="/organizer-dashboard/myevents">My Events</Link>
          </li>
          <li>
            <Link to="/organizer-dashboard/add-event">Create Event</Link>
          </li>
          <li>
            <Link to="/organizer-dashboard/venues">View Venues</Link>
          </li>
        </ul>
      </nav>

      {/* Right Content Area */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="myevents" />} />
          <Route path="myevents" element={<MyEvents />} />
          <Route path="add-event" element={<AddEvents />} />
          <Route path="venues" element={<ViewVenues />} />
        </Routes>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
