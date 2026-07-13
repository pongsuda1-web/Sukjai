"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('jhw');
  const [hospitalId, setHospitalId] = useState('');
  const [clinics, setClinics] = useState([]);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchClinics = async () => {
      const { data } = await supabase.from('clinics').select('id, name, type').order('name');
      if (data) setClinics(data);
    };
    fetchClinics();
  }, [supabase]);

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
    
    const result = await register(email, password, fullName, role, hospitalId || null);
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
        width: "400px",
        maxHeight: "90vh",
        overflowY: "auto"
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
              <label htmlFor="role" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500, fontSize: "0.9rem" }}>ตำแหน่ง / บทบาท</label>
              <select 
                id="role" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", backgroundColor: "#fff" }}
              >
                <option value="jhw">อสม. / เจ้าหน้าที่สาธารณสุขชุมชน</option>
                <option value="doctor">แพทย์ / พยาบาล</option>
                <option value="social_worker">นักสังคมสงเคราะห์</option>
                <option value="manager">ผู้บริหาร / หัวหน้างาน</option>
              </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="hospitalId" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500, fontSize: "0.9rem" }}>สถานพยาบาลที่สังกัด (ถ้ามี)</label>
              <select 
                id="hospitalId" 
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", backgroundColor: "#fff" }}
              >
                <option value="">-- ไม่ระบุ / ดูภาพรวมระดับจังหวัด --</option>
                <optgroup label="โรงพยาบาล">
                  {clinics.filter(c => c.type === 'hospital' || !c.type).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </optgroup>
                <optgroup label="รพ.สต.">
                  {clinics.filter(c => c.type === 'pcu').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </optgroup>
              </select>
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
              <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500, fontSize: "0.9rem" }}>ยืนยันรหัสผ่าน</label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
              />
            </div>
            
            {error && <div style={{ color: "#d32f2f", marginBottom: "1rem", fontSize: "0.9rem", padding: "0.5rem", background: "#ffebee", borderRadius: "4px" }}>{error}</div>}
            
            <button type="submit" disabled={loading} style={{
              background: loading ? "#90caf9" : "#0277bd",
              color: "#fff",
              border: "none",
              padding: "0.6rem 1rem",
              width: "100%",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: loading ? "default" : "pointer",
              marginBottom: "1rem"
            }}>
              {loading ? 'กำลังดำเนินการ...' : 'สมัครสมาชิก'}
            </button>
            <div style={{ textAlign: "center", fontSize: "0.9rem" }}>
              <span style={{ color: "#5f5e5a" }}>มีบัญชีผู้ใช้งานแล้ว? </span>
              <a href="/login" style={{ color: "#0277bd", textDecoration: "none", fontWeight: 500 }}>เข้าสู่ระบบ</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
