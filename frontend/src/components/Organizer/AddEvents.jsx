// src/components/Organizer/AddEvents.jsx
import React, { useState, useEffect } from "react";
import "./AddEvents.css"; // We'll define styles next

const AddEvents = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    start_time: "",
    end_time: "",
    max_participants: "",
    venue_id: "",
    gform_link: "",
    gspreadsheet_link: "",
    image_url: "",
    phone_number: "",
    mail_id: "",
    status: "Green",
  });

  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // success or error
  const organizerId = localStorage.getItem("userId"); // stored from SignIn

  // Fetch all venues for dropdown
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/venues");
        const data = await res.json();

        if (data.success) {
          setVenues(data.venues);
        } else {
          setMessageType("error");
          setMessage(data.message || "Failed to fetch venues");
        }
      } catch (err) {
        setMessageType("error");
        setMessage("Server error: " + err.message);
      }
    };

    fetchVenues();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple frontend validation
    const requiredFields = [
      "title",
      "date",
      "start_time",
      "end_time",
      "max_participants",
      "venue_id",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field] === "Select Venue"
    );

    if (missingFields.length > 0) {
      setMessageType("error");
      setMessage("Please fill all required fields");
      return;
    }

    const body = {
      ...formData,
      organizer_id: organizerId,
      max_participants: Number(formData.max_participants),
    };

    try {
      const res = await fetch("http://localhost:5000/api/events/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setMessageType("success");
        setMessage("Event created successfully!");
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          date: "",
          start_time: "",
          end_time: "",
          max_participants: "",
          venue_id: "",
          gform_link: "",
          gspreadsheet_link: "",
          image_url: "",
          phone_number: "",
          mail_id: "",
          status: "Green",
        });
      } else {
        setMessageType("error");
        setMessage(data.error || "Failed to create event");
      }
    } catch (err) {
      setMessageType("error");
      setMessage("Server error: " + err.message);
    }
  };

  return (
    <div className="add-event-container">
      <h2>Create Event</h2>
      {message && (
        <div className={`message ${messageType}`}>{message}</div>
      )}
      <form className="add-event-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Event Title *"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
        />
        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
        />
        <input
          type="number"
          name="max_participants"
          placeholder="Max Participants *"
          value={formData.max_participants}
          onChange={handleChange}
        />
        <select name="venue_id" value={formData.venue_id} onChange={handleChange}>
          <option>Select Venue *</option>
          {venues.map((v) => (
            <option key={v.id} value={v.id}>
              {v.venue_name}
            </option>
          ))}
        </select>
        <input
          type="url"
          name="gform_link"
          placeholder="Google Form Link"
          value={formData.gform_link}
          onChange={handleChange}
        />
        <input
          type="url"
          name="gspreadsheet_link"
          placeholder="Google Spreadsheet Link"
          value={formData.gspreadsheet_link}
          onChange={handleChange}
        />
        <input
          type="url"
          name="image_url"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
        />
        <input
          type="email"
          name="mail_id"
          placeholder="Email ID"
          value={formData.mail_id}
          onChange={handleChange}
        />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default AddEvents;
