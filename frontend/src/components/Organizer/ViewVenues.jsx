import React, { useEffect, useState } from "react";

const ViewVenues = () => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
  const fetchVenues = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/venues");
      const data = await res.json();

      if (data.success) {
        setVenues(data.venues); // Only store the venues array
      } else {
        console.error("Error fetching venues:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

    fetchVenues();
  }, []);

  return (
    <div>
      <h2>Available Venues</h2>
      {venues.length === 0 ? (
        <p>No venues found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {venues.map((venue) => (
            <div
              key={venue.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              {venue.image_url && (
                <img
                  src={venue.image_url}
                  alt={venue.venue_name}
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
              )}
              <h3>{venue.venue_name}</h3>
              <p>{venue.venue_description}</p>
              <p>
                <strong>Phone:</strong> {venue.phone_number || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {venue.mail_id || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewVenues;
