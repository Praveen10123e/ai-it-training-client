import { useState } from "react";
import axios from "axios";
import "./login.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://ai-it-training-server.onrender.com/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registered successfully!");
      window.location = "/";
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>📝 Create Account</h1>
        <p className="subtitle">Join AI IT Training System</p>

        <form onSubmit={register}>
          <input
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit">Register</button>
        </form>

        <p className="signup-link" onClick={() => window.location="/"}>
          Already have account? Login
        </p>
      </div>
    </div>
  );
}
