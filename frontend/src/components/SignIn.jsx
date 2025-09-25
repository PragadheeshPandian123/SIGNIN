import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn({setRole}) {
  const navigate = useNavigate();
  const [reg_no,setReg_no]=useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({reg_no, email, password })
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
    <div style={{ padding: 20 }}>
      <h2>Sign In (Demo) </h2>
      <input 
        type="number" 
        placeholder="Registration Number"
        value={reg_no}
        onChange={(e)=> setReg_no(e.target.value)}
      />
    <br /><br />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br/><br/>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br/><br/>
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>

    </div>
  );
}
export default SignIn;