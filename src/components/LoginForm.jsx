import React from 'react'
import "../css/LoginForm.css"
import { useState,useEffect } from 'react'
import { useNavigate} from 'react-router';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { sendPost } from '../api/posts';

export const LoginForm = () => {
  // State for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate=useNavigate()

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

    navigate('/home')
    // try {
    //   const res = await sendPost(username, password);
    //   console.log(res)

    //   if (res.username) {
    //     // if your backend sends a JWT token
    //     navigate('/home')
    //   } else {
    //     setError("Invalid credentials.");
    //   }
    // } catch (err) {
    //   console.error("Login error:", err);
    //   setError("Something went wrong. Try again.");
    // }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <img src="/hustle_name.png" alt="Company Logo" style={{display: 'block', margin: '0 auto 20px auto', maxWidth: '300px', height: 'auto'}} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="input-box">
          <input type="text" placeholder="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <FaLock className="icon" />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  )
}
