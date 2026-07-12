"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
    setLoading(false);
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
            <label htmlFor="email" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500 }}>Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" disabled={loading} style={{
            background: loading ? "#90caf9" : "#0277bd",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1rem",
            width: "100%",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600
          }}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
          </button>
          
          {error && (
            <div style={{ color: "#d32f2f", marginTop: "0.5rem", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}
          
          <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem", color: "#5f5e5a" }}>
            ยังไม่มีบัญชีผู้ใช้งาน? <a href="/register" style={{ color: "#0277bd", textDecoration: "none", fontWeight: 600 }}>สมัครสมาชิกที่นี่</a>
          </div>
        </form>
      </div>
    </div>
  );
}
