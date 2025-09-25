import React, { useState } from "react";

function SignUp() {
  const [formData, setFormData] = useState({
    reg_no:"",
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "IT",
    year: "1st year",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Account created successfully! You can sign in now.");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server error, please try again.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sign Up</h2>


      <input
        type="number"
        name="reg_no"
        placeholder="Registration Number"
        value={formData.reg_no}
        onChange={handleChange}
      /><br /><br />

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange} 
        required
      /><br /><br />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      /><br /><br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      /><br /><br />

      <label>Role: </label>
      <select name="role" value={formData.role} onChange={handleChange} required>
        <option value="student">Student</option>
        <option value="event_organizer">Event Organizer</option>
        <option value="admin">Admin</option>
      </select><br /><br />

      <label>Department: </label>
      <select name="department" value={formData.department} onChange={handleChange} required>
        <option value="CSE">CSE</option>
        <option value="IT">IT</option>
        <option value="AIDS">AIDS</option>
        <option value="ECE">ECE</option>
      </select><br /><br />

      <label>Year: </label>
      <select name="year" value={formData.year} onChange={handleChange} required>
        <option value="1st year">1st year</option>
        <option value="2nd year">2nd year</option>
        <option value="3rd year">3rd year</option>
        <option value="4th year">4th year</option>
      </select><br /><br />

      <button onClick={handleSubmit}>Sign Up</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignUp;
