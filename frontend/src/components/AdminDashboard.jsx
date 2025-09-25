import { useState } from "react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showForm,setShowForm]=useState(false);
  // For adding/editing users
  const [formData, setFormData] = useState({
    reg_no: "",
    name: "",
    email: "",
    role: "student",
    department: "CSE",
    year: "1st year",
    password: "",
  });

  const [editingId, setEditingId] = useState(null); // null means creating, otherwise editing

  // Fetch all users
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users");
    const data = await res.json();
    setUsers(data);
    setShowUsers(true);
  };

  // Delete user
  const deleteUser = async (id) => {
    const res = await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success) setUsers(users.filter(u => u._id !== id));
  };

  // Submit add/edit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Edit user
      const res = await fetch(`http://localhost:5000/api/users/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        setUsers(users.map(u => (u._id === editingId ? { ...u, ...formData } : u)));
        setEditingId(null);
        setFormData({
          reg_no: "",
          name: "",
          email: "",
          role: "student",
          department: "CSE",
          year: "1st year",
          password: "",
        });
      }
    } else {
      // Add new user
      const res = await fetch(`http://localhost:5000/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
      const result = await res.json();
      if (result.success) {
        fetchUsers(); // refresh list
        setFormData({
          reg_no: "",
          name: "",
          email: "",
          role: "student",
          department: "CSE",
          year: "1st year",
          password: "",
        });
      } else {
        alert(result.message);
      }
    }
    setShowForm(false);
  };

  // Fill form with existing user data for editing
  const handleEdit = (user) => {
    setEditingId(user._id);
    setFormData({
      reg_no: user.reg_no,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      year: user.year,
      password: "", // admin can reset password if needed
    });
    setShowForm(true);
  };

  const handleAddUserClick = () => {
    setEditingId(null); // clear editing
    setFormData({
      reg_no: "",
      name: "",
      email: "",
      role: "student",
      department: "CSE",
      year: "1st year",
      password: "",
    });
    setShowForm(true); // show form on Add User
  };


  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      <button onClick={fetchUsers}>Show Users</button>
      <br /><br />
      <button onClick={handleAddUserClick}>Add User</button>
      {showUsers && (
        <table border="1" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Year</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.reg_no}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.department}</td>
                <td>{user.year}</td>
                <td>{user.created_at}</td> 
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => deleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Form for adding/editing user */}
      {showForm && (
        <>
        <h3>{editingId ? "Edit User" : "Add New User"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Reg No"
          value={formData.reg_no}
          onChange={(e) => setFormData({ ...formData, reg_no: e.target.value })}
          required
        /><br/><br/>

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        /><br/><br/>

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        /><br/><br/>

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!editingId} // required only when creating new user
        /><br/><br/>

        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="organizer">Event Organizer</option>
          <option value="admin">Admin</option>
        </select><br/><br/>

        <select
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        >
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="AIDS">AIDS</option>
          <option value="ECE">ECE</option>
        </select><br/><br/>

        <select
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        >
          <option value="1st year">1st year</option>
          <option value="2nd year">2nd year</option>
          <option value="3rd year">3rd year</option>
          <option value="4th year">4th year</option>
        </select><br/><br/>

        <button type="submit">{editingId ? "Update User" : "Add User"}</button>
      </form>

        </>
      )}
      
    </div>
  );
}

export default AdminDashboard;
