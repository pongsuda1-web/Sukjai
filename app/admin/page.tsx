'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, MessageSquare, BookText, ClipboardList, Users, LogOut, Building2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{id: number, username: string, role: string} | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [diaries, setDiaries] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'diaries' | 'surveys' | 'hospitals' | 'staff'>('posts');
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [editingHospital, setEditingHospital] = useState<any>(null);
  const [hospitalForm, setHospitalForm] = useState({
    name: '', province: '', region: 'north', type: 'provincial', address: '', phone: '', lat: '', lng: ''
  });
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(true);

  // Check auth
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    if (activeTab === 'posts') {
      fetch('/api/posts')
        .then(res => res.json())
        .then(data => {
          if (data.posts) setPosts(data.posts);
          setLoading(false);
        });
    } else if (activeTab === 'diaries') {
      fetch('/api/admin/diaries')
        .then(res => res.json())
        .then(data => {
          if (data.logs) setDiaries(data.logs);
          setLoading(false);
        });
    } else if (activeTab === 'surveys') {
      fetch('/api/admin/surveys')
        .then(res => res.json())
        .then(data => {
          if (data.surveys) setSurveys(data.surveys);
          setLoading(false);
        });
    } else if (activeTab === 'hospitals') {
      fetchHospitals();
    } else if (activeTab === 'staff' && user.role === 'admin') {
      fetchStaff();
    }
  }, [activeTab, user]);

  const fetchHospitals = () => {
    fetch('/api/hospitals')
      .then(res => res.json())
      .then(data => {
        setHospitals(data);
        setLoading(false);
      });
  };

  const fetchStaff = () => {
    fetch('/api/admin/staff')
      .then(res => res.json())
      .then(data => {
        if (data.staff) setStaff(data.staff);
        setLoading(false);
      });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword })
      });
      if (res.ok) {
        setNewUsername('');
        setNewPassword('');
        fetchStaff();
        alert('สร้างบัญชีผู้ช่วยสำเร็จ');
      } else {
        const data = await res.json();
        alert(data.error || 'สร้างไม่สำเร็จ');
      }
    } catch (e) {
      alert('Error creating staff');
    }
  };

  const handleDeleteStaff = async (id: number) => {
    if (!confirm('ยืนยันการลบบัญชีนี้?')) return;
    try {
      const res = await fetch(`/api/admin/staff?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchStaff();
      } else {
        alert('ไม่สามารถลบได้');
      }
    } catch (e) {
      alert('Error deleting staff');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('ยืนยันการลบกระทู้นี้พร้อมคอมเมนต์ทั้งหมด?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      } else {
        alert('ลบไม่สำเร็จ');
      }
    } catch (e) {
      alert('Error deleting post');
    }
  };

  const handleDeleteHospital = async (id: string) => {
    if (!confirm('ยืนยันการลบโรงพยาบาลนี้?')) return;
    try {
      const res = await fetch(`/api/admin/hospitals?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHospitals(hospitals.filter(h => h.id !== id));
      } else {
        alert('ลบไม่สำเร็จ');
      }
    } catch (e) {
      alert('Error deleting hospital');
    }
  };

  const handleSaveHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingHospital ? 'PUT' : 'POST';
      const body = editingHospital ? { ...hospitalForm, id: editingHospital.id } : hospitalForm;
      const res = await fetch('/api/admin/hospitals', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setShowHospitalForm(false);
        setEditingHospital(null);
        fetchHospitals();
      } else {
        alert('บันทึกไม่สำเร็จ');
      }
    } catch (e) {
      alert('Error saving hospital');
    }
  };

  const openEditHospital = (h: any) => {
    setEditingHospital(h);
    setHospitalForm({
      name: h.name, province: h.province, region: h.region, type: h.type,
      address: h.address, phone: h.phone, lat: String(h.lat), lng: String(h.lng)
    });
    setShowHospitalForm(true);
  };

  if (!user) return <div style={{ textAlign: 'center', padding: '5rem' }}>กำลังตรวจสอบสิทธิ์...</div>;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldCheck size={36} className="text-primary" />
          <div>
            <h1 className="section-title" style={{ margin: 0, textAlign: 'left', marginBottom: '0.25rem' }}>ศูนย์ควบคุมข้อมูล</h1>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
              เข้าสู่ระบบในชื่อ: <strong>{user.username}</strong> ({user.role})
            </span>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: '#64748b', borderColor: '#cbd5e1' }}>
          <LogOut size={16} /> ออกจากระบบ
        </button>
      </div>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        หน้านี้สำหรับแอดมิน (Dr.Pongsuda) ใช้ตรวจสอบข้อมูลเว็บบอร์ด บันทึกไดอารี่ และข้อมูลงานวิจัยทั้งหมดในระบบ
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('posts')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            borderRadius: 'var(--radius-md)', 
            border: 'none',
            background: activeTab === 'posts' ? 'var(--color-primary-dark)' : '#f1f5f9',
            color: activeTab === 'posts' ? 'white' : 'var(--color-text-muted)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <MessageSquare size={18} /> จัดการเว็บบอร์ด
        </button>
        <button 
          onClick={() => setActiveTab('diaries')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            borderRadius: 'var(--radius-md)', 
            border: 'none',
            background: activeTab === 'diaries' ? 'var(--color-primary-dark)' : '#f1f5f9',
            color: activeTab === 'diaries' ? 'white' : 'var(--color-text-muted)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <BookText size={18} /> บันทึกไดอารี่
        </button>
        <button 
          onClick={() => setActiveTab('surveys')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            borderRadius: 'var(--radius-md)', 
            border: 'none',
            background: activeTab === 'surveys' ? 'var(--color-primary-dark)' : '#f1f5f9',
            color: activeTab === 'surveys' ? 'white' : 'var(--color-text-muted)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ClipboardList size={18} /> ข้อมูลงานวิจัย
        </button>
        {user.role === 'admin' && (
          <button 
            onClick={() => setActiveTab('hospitals')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: 'var(--radius-md)', 
              border: 'none',
              background: activeTab === 'hospitals' ? 'var(--color-primary-dark)' : '#f1f5f9',
              color: activeTab === 'hospitals' ? 'white' : 'var(--color-text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Building2 size={18} /> จัดการสถานพยาบาล
          </button>
        )}
        {user.role === 'admin' && (
          <button 
            onClick={() => setActiveTab('staff')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: 'var(--radius-md)', 
              border: 'none',
              background: activeTab === 'staff' ? 'var(--color-primary-dark)' : '#f1f5f9',
              color: activeTab === 'staff' ? 'white' : 'var(--color-text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Users size={18} /> จัดการเจ้าหน้าที่
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>กำลังโหลดข้อมูล...</div>
      ) : (
        <>
          {activeTab === 'posts' && (
            <div>
              {posts.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>ยังไม่มีกระทู้ในระบบ</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {posts.map(post => (
                    <div key={post.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--color-primary)' }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{post.title}</h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          โพสต์โดย: {post.author} | เมื่อ: {new Date(post.created_at).toLocaleString('th-TH')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link href={`/community/${post.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                          ดูและตอบ
                        </Link>
                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', color: '#dc2626', borderColor: '#fca5a5' }} onClick={() => handleDeletePost(post.id)}>
                          ลบ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'diaries' && (
            <div>
              {diaries.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>ยังไม่มีผู้บันทึกไดอารี่</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {diaries.map(diary => (
                    <div key={diary.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong style={{ color: 'var(--color-primary-dark)' }}>อารมณ์: {diary.mood}</strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{new Date(diary.created_at).toLocaleString('th-TH')}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        User ID: {diary.user_id}
                      </div>
                      {diary.note ? (
                        <p style={{ margin: 0, padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
                          {diary.note}
                        </p>
                      ) : (
                        <p style={{ margin: 0, fontStyle: 'italic', color: '#cbd5e1' }}>ไม่มีข้อความระบาย</p>
                      )}
                      {diary.system_reply && (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3e8ff', borderLeft: '4px solid #d8b4fe', borderRadius: 'var(--radius-sm)' }}>
                          <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#6b21a8', fontSize: '0.9rem' }}>การตอบกลับจากระบบ:</strong>
                          <span style={{ fontSize: '0.9rem' }}>{diary.system_reply}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'surveys' && (
            <div>
              {surveys.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>ยังไม่มีผู้ทำแบบสอบถามงานวิจัย</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {surveys.map((survey: any) => (
                    <div key={survey.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <strong>ผู้ตอบแบบสอบถาม #{survey.id}</strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{new Date(survey.created_at).toLocaleString('th-TH')}</span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                        <div><strong style={{ color: 'var(--color-text-muted)' }}>อายุ:</strong> {survey.age || '-'}</div>
                        <div><strong style={{ color: 'var(--color-text-muted)' }}>เพศ:</strong> {survey.gender || '-'}</div>
                        <div><strong style={{ color: 'var(--color-text-muted)' }}>อาชีพ:</strong> {survey.occupation || '-'}</div>
                        <div><strong style={{ color: 'var(--color-text-muted)' }}>คะแนนความพึงพอใจ:</strong> {survey.satisfaction_score || '-'}/5</div>
                      </div>

                      <hr style={{ margin: '1rem 0', borderColor: '#e2e8f0' }} />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                        <div><strong style={{ color: 'var(--color-text-muted)' }}>รู้จักเราผ่าน:</strong> <br/>{survey.how_known || '-'}</div>
                        <div><strong style={{ color: 'var(--color-text-muted)' }}>ความคาดหวัง:</strong> <br/>{survey.expectations || '-'}</div>
                        <div><strong style={{ color: 'var(--color-text-muted)' }}>ได้รับความช่วยเหลือไหม?:</strong> <br/>{survey.is_helpful || '-'}</div>
                        <div><strong style={{ color: 'var(--color-text-muted)' }}>ข้อเสนอแนะ:</strong> <br/>{survey.feedback || '-'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'hospitals' && user.role === 'admin' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <h3>รายชื่อสถานพยาบาลทั้งหมด ({hospitals.length})</h3>
                {!showHospitalForm && (
                  <button className="btn btn-primary" onClick={() => {
                    setEditingHospital(null);
                    setHospitalForm({ name: '', province: '', region: 'north', type: 'provincial', address: '', phone: '', lat: '', lng: '' });
                    setShowHospitalForm(true);
                  }}>+ เพิ่มสถานพยาบาล</button>
                )}
              </div>

              {showHospitalForm ? (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '1.5rem' }}>{editingHospital ? 'แก้ไขสถานพยาบาล' : 'เพิ่มสถานพยาบาลใหม่'}</h4>
                  <form onSubmit={handleSaveHospital} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>ชื่อสถานพยาบาล</label>
                      <input required type="text" className="form-control" value={hospitalForm.name} onChange={e => setHospitalForm({...hospitalForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>ภาค</label>
                      <select className="form-control" value={hospitalForm.region} onChange={e => setHospitalForm({...hospitalForm, region: e.target.value})}>
                        <option value="central">ภาคกลาง และ กทม.</option>
                        <option value="north">ภาคเหนือ</option>
                        <option value="northeast">ภาคตะวันออกเฉียงเหนือ</option>
                        <option value="south">ภาคใต้</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>จังหวัด</label>
                      <input required type="text" className="form-control" value={hospitalForm.province} onChange={e => setHospitalForm({...hospitalForm, province: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>ประเภท</label>
                      <select className="form-control" value={hospitalForm.type} onChange={e => setHospitalForm({...hospitalForm, type: e.target.value})}>
                        <option value="provincial">โรงพยาบาลศูนย์/ทั่วไป</option>
                        <option value="community">โรงพยาบาลชุมชน</option>
                        <option value="private">คลินิก/โรงพยาบาลเอกชน</option>
                        <option value="wellness">ศูนย์สุขภาพจิต</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>เบอร์โทรศัพท์</label>
                      <input required type="text" className="form-control" value={hospitalForm.phone} onChange={e => setHospitalForm({...hospitalForm, phone: e.target.value})} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>ที่อยู่</label>
                      <input required type="text" className="form-control" value={hospitalForm.address} onChange={e => setHospitalForm({...hospitalForm, address: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>ละติจูด (Latitude)</label>
                      <input required type="number" step="any" className="form-control" value={hospitalForm.lat} onChange={e => setHospitalForm({...hospitalForm, lat: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>ลองจิจูด (Longitude)</label>
                      <input required type="number" step="any" className="form-control" value={hospitalForm.lng} onChange={e => setHospitalForm({...hospitalForm, lng: e.target.value})} />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary">บันทึกข้อมูล</button>
                      <button type="button" className="btn btn-outline" onClick={() => setShowHospitalForm(false)}>ยกเลิก</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {hospitals.map(hospital => (
                    <div key={hospital.id} className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #0ea5e9' }}>
                      <div>
                        <strong style={{ fontSize: '1.1rem' }}>{hospital.name}</strong>
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                          {hospital.type}
                        </span>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                          {hospital.province} ({hospital.region}) - โทร: {hospital.phone}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEditHospital(hospital)} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                          แก้ไข
                        </button>
                        <button onClick={() => handleDeleteHospital(hospital.id)} className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#fca5a5', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                          ลบ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'staff' && user.role === 'admin' && (
            <div>
              <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>สร้างบัญชีผู้ช่วยใหม่ (Assistant)</h3>
                <form onSubmit={handleCreateStaff} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ชื่อผู้ใช้ (Username)</label>
                    <input type="text" required value={newUsername} onChange={e => setNewUsername(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>รหัสผ่าน (Password)</label>
                    <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>เพิ่มบัญชี</button>
                </form>
              </div>

              <h3 style={{ marginBottom: '1rem' }}>รายชื่อเจ้าหน้าที่ในระบบ</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {staff.map(member => (
                  <div key={member.id} className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem' }}>{member.username}</strong>
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', background: member.role === 'admin' ? '#fca5a5' : '#bfdbfe', color: member.role === 'admin' ? '#991b1b' : '#1e40af', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                        {member.role}
                      </span>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        สร้างเมื่อ: {new Date(member.created_at).toLocaleString('th-TH')}
                      </div>
                    </div>
                    {member.role !== 'admin' && (
                      <button onClick={() => handleDeleteStaff(member.id)} className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#fca5a5', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                        ลบบัญชี
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
