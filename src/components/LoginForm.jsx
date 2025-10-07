import React from 'react'
import "../css/LoginForm.css"
import { Spinner } from 'react-bootstrap';
import { useState,useEffect } from 'react'
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { sendPost } from '../api/posts';


export const LoginForm = (props) => {
  // State for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(false);
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
      setConfirm(true)
      const res = await sendPost(username, password);

      if (res.username) {
        props.setUser(res.username)

        if (!props.needLogin){
          props.setPage('home')
        }else{
          props.setNeedLogin(false)
        }
      } else {
        setConfirm(false)
        setPassword("")
        setUsername("")
        setError(res.error);
      }
    } catch (err) {
      setConfirm(false)
      console.error("Login error:", err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className={props.needLogin ? 'overlay ' : ''}>
      <div className={props.needLogin ? 'wrapper-overlay' : 'wrapper'}>
        <form onSubmit={handleSubmit}>
          <img src="/hustle_name.png" alt="Company Logo" style={{display: 'block', margin: '0 auto 20px auto', maxWidth: '300px', height: 'auto'}} />
          { props.needLogin ?
            <div style={{ fontSize: '1em', color: '#D6AD42', fontWeight: '600' }}>Sessione scaduta. Esegui il login:</div>
            :
            ""
          }
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="input-box">
            <input type="text" placeholder="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <FaLock className="icon" />
          </div>

          {!confirm ? <button type="submit">Login</button> :
            <button type="submit" disabled>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </button>
            
          }
        </form>
      </div>
    </div>
  )
}
