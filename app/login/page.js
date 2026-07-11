"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (login(username, password)) {
      // Login success is handled by AuthContext redirect
    } else {
      setError('บัญชียังไม่ได้รับการอนุมัติจากผู้ดูแลระบบ หรือข้อมูลไม่ถูกต้อง');
    }
  };

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: "linear-gradient(135deg, #e0f7fa, #b3e5fc)",
      margin: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh"
    }}>
      <div style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "320px"
      }}>
        <h1 style={{ fontSize: "1.4rem", marginBottom: "0.5rem", textAlign: "center" }}>
          ระบบการติดตาม "น่านสุขใจ"
        </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="username" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500 }}>Username</label>
            <input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>
          <button type="submit" style={{
            background: "#0277bd",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1rem",
            width: "100%",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 600
          }}>Login</button>
          
          {error && (
            <div style={{ color: "#d32f2f", marginTop: "0.5rem", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
