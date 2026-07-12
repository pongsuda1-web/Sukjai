"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, loginWithLine } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
    }
    
    if (password.length < 6) {
      return setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    }

    setLoading(true);
    
    const result = await register(email, password, fullName);
    if (!result.success) {
      setError(result.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
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
      minHeight: "100vh"
    }}>
      <div style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "360px"
      }}>
        <h1 style={{ fontSize: "1.4rem", marginBottom: "0.5rem", textAlign: "center" }}>
          สมัครสมาชิก "น่านสุขใจ"
        </h1>
        
        {success ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ color: "#2e7d32", fontSize: "1.2rem", marginBottom: "1rem" }}>สมัครสมาชิกสำเร็จ!</div>
            <p style={{ color: "#5f5e5a", fontSize: "0.9rem" }}>กำลังพากลับไปหน้าเข้าสู่ระบบ...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="fullName" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500, fontSize: "0.9rem" }}>ชื่อ - นามสกุล</label>
              <input 
                type="text" 
                id="fullName" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="email" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500, fontSize: "0.9rem" }}>อีเมล (Email)</label>
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
              <label htmlFor="password" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500, fontSize: "0.9rem" }}>รหัสผ่าน (Password)</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500, fontSize: "0.9rem" }}>ยืนยันรหัสผ่านอีกครั้ง</label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "กำลังสมัครสมาชิก..." : "ลงทะเบียน (Register)"}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }}></div>
              <span style={{ padding: '0 10px', color: '#888', fontSize: '0.85rem' }}>หรือ</span>
              <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }}></div>
            </div>
            
            <button 
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const result = await loginWithLine();
                if (!result.success) {
                  setError(result.error || 'ไม่สามารถสมัครสมาชิกด้วย LINE ได้');
                  setLoading(false);
                }
              }}
              style={{
                background: loading ? "#a5d6a7" : "#00B900",
                color: "#fff",
                border: "none",
                padding: "0.6rem 1rem",
                width: "100%",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {loading ? "กำลังเชื่อมต่อ..." : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.6 10.3C23.6 4.6 18.3 0 11.8 0C5.3 0 0 4.6 0 10.3C0 15.1 4 19.3 9.4 20.3C9.7 20.4 10.5 20.6 10.7 21C10.8 21.2 10.7 22.1 10.7 22.3C10.6 22.9 10.2 24 10.2 24C10.2 24 11 24 11.9 23.4C12.9 22.8 17.5 20.2 19.9 17.8C22.2 15.5 23.6 13 23.6 10.3Z" fill="white"/>
                  </svg>
                  สมัครด้วยบัญชี LINE
                </>
              )}
            </button>
            
            {error && (
              <div style={{ color: "#d32f2f", marginTop: "0.5rem", fontSize: "0.9rem", textAlign: "center" }}>
                {error}
              </div>
            )}
            
            <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem", color: "#5f5e5a" }}>
              มีบัญชีอยู่แล้ว? <a href="/login" style={{ color: "#0277bd", textDecoration: "none", fontWeight: 600 }}>เข้าสู่ระบบที่นี่</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
