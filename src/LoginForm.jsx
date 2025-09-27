import React from 'react'
import './LoginForm.css'
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

export const LoginForm = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1>Login</h1>
        <div className="input-box">
          <input type="text" placeholder="username" required />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input type="text" placeholder="Password" required />
          <FaLock className="icon" />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  )
}
