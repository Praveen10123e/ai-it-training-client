import { useState } from "react";
import axios from "axios";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://ai-it-training-server.onrender.com/api/auth/login",
        { email, password }
      );

      // Save logged-in user
      localStorage.setItem("user", JSON.stringify(res.data));

      // Redirect
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🎓 AI IT Training System</h1>
        <p className="subtitle">Learn • Practice • Grow</p>

        {error && <div className="error-box">{error}</div>}

        <form autoComplete="off" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className="signup-link"
          onClick={() => (window.location.href = "/register")}
        >
          Don’t have an account? Sign Up
        </p>

        <p className="footer-text">
          Admin & Student access supported
        </p>
      </div>
    </div>
  );
}
