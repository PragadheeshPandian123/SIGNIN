import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn({ setRole }) {
  const navigate = useNavigate();
  const [reg_no, setReg_no] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reg_no, email, password }),
      });
      const data = await response.json();

      if (data.success) {
        setRole(data.role);
        navigate(`/${data.role}-dashboard`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "28rem" }}>
        <h3 className="text-center mb-4">Sign In</h3>

        <div className="mb-3">
          <label className="form-label">Registration Number</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter registration number"
            value={reg_no}
            onChange={(e) => setReg_no(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-danger mb-3">{error}</p>}

        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>
          Login
        </button>

        <p className="text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-decoration-none">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
