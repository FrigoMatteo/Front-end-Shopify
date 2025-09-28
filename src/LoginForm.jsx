import React from 'react'
import './LoginForm.css'
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { sendPost } from './api/posts';

export const LoginForm = () => {
  // State for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Regex: only letters, numbers, and . , _ ! ?
  const validPattern = /^[a-zA-Z0-9.,_!?]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

     // 1. Check empty fields
    if (!username || !password) {
      setError("Username and password cannot be empty.");
      return;
    }

    // 2. Check allowed characters
    if (!validPattern.test(username) || !validPattern.test(password)) {
      setError(
        "Only letters, numbers and . , _ ! ? are allowed in username and password."
      );
      return;
    }

    try {
      const res = await sendPost(username, password);

      if (res.token) {
        // if your backend sends a JWT token
        localStorage.setItem("token", res.token);
        alert("Login successful!");
        // TODO: redirect to /orders
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="input-box">
          <input type="text" placeholder="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input type="text" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <FaLock className="icon" />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  )
}
