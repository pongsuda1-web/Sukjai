"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { X, Search, MapPin } from 'lucide-react';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), { ssr: false });

export default function PatientForm({ onClose, onSave, clinics, initialData, currentUser }) {
  const [formData, setFormData] = useState({
    hn: initialData?.hn || '',
    full_name: initialData?.name || '',
    dx: initialData?.dx || '',
    risk: initialData?.risk || 'green',
    smi_v: initialData?.smiV || '',
    followup_frequency: initialData?.followup || 'รายเดือน',
    address: initialData?.village || '',
    subdistrict: '',
    district: '',
    province: 'น่าน',
    hospital_id: initialData?.hospital_id || '',
    notes: initialData?.notes || '',
    medication_status: initialData?.medicationStatus ?? true,
    last_visit_date: initialData?.last_visit_date || new Date().toISOString().split('T')[0]
  });

  const [position, setPosition] = useState(initialData ? [initialData.lat, initialData.lng] : null);
  const [loadingGeocode, setLoadingGeocode] = useState(false);
  
  const isRestrictedRole = currentUser?.role === 'jhw' || currentUser?.role === 'social_worker';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchAddress = async () => {
    setLoadingGeocode(true);
    try {
      // 1. ลองค้นหาแบบละเอียดที่สุดก่อน (รวมบ้านเลขที่)
      const fullQuery = `${formData.address} ${formData.subdistrict} ${formData.district} ${formData.province}`.trim();
      if (!fullQuery) return;

      let res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullQuery)}&format=json&limit=1`);
      let data = await res.json();

      // 2. ถ้าไม่พบแบบละเอียด ให้ลองค้นหาแค่ ตำบล อำเภอ จังหวัด (ตัดบ้านเลขที่/หมู่บ้านออก เพราะแผนที่อาจจะไม่รู้จัก)
      if (!data || data.length === 0) {
        const fallbackQuery = `${formData.subdistrict} ${formData.district} ${formData.province}`.trim();
        if (fallbackQuery) {
          res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fallbackQuery)}&format=json&limit=1`);
          data = await res.json();
        }
      }
      
      // 3. ถ้ายังไม่พบอีก ให้ลองค้นหาแค่ อำเภอ จังหวัด
      if (!data || data.length === 0) {
        const fallbackQuery2 = `${formData.district} ${formData.province}`.trim();
        if (fallbackQuery2) {
          res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fallbackQuery2)}&format=json&limit=1`);
          data = await res.json();
        }
      }

      if (data && data.length > 0) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        alert("ระบบค้นหาพิกัดไม่พบที่อยู่ดังกล่าว (อาจจะละเอียดเกินไป) \n\nกรุณาเลื่อนแผนที่ด้านล่าง แล้วใช้ 'นิ้วจิ้ม' หรือ 'เมาส์คลิก' เพื่อปักหมุดที่ตั้งบ้านบนแผนที่ด้วยตัวเองได้เลยครับ");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบแผนที่ กรุณาใช้วิธีคลิกเลือกจุดบนแผนที่โดยตรง");
    } finally {
      setLoadingGeocode(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position) {
      alert("กรุณาระบุตำแหน่งพิกัดบนแผนที่");
      return;
    }
    
    // Combine address parts into village string (or just use address)
    const villageStr = `${formData.address} ต.${formData.subdistrict} อ.${formData.district} จ.${formData.province}`;

    const submissionData = {
      ...formData,
      village: villageStr,
      latitude: position[0],
      longitude: position[1]
    };
    
    // Remove individual address fields as they are not in schema
    delete submissionData.address;
    delete submissionData.subdistrict;
    delete submissionData.district;
    delete submissionData.province;

    onSave(submissionData);
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="modal-content" style={{
        background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '800px',
        maxHeight: '90vh', overflowY: 'auto', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#2c3e50' }}>
            {initialData ? 'แก้ไขข้อมูลผู้ป่วย' : 'เพิ่มทะเบียนผู้ป่วยใหม่'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>รหัสผู้ป่วย (HN) *</label>
              <input type="text" name="hn" required value={formData.hn} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>ชื่อ-นามสกุล *</label>
              <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>
            
            {!isRestrictedRole && (
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>การวินิจฉัย (ICD-10) *</label>
                <input type="text" name="dx" required={!isRestrictedRole} value={formData.dx} onChange={handleChange} placeholder="เช่น F20.0" className="form-input" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>ระดับความเสี่ยง *</label>
              <select name="risk" required value={formData.risk} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <option value="green">สีเขียว (Green)</option>
                <option value="yellow">สีเหลือง (Yellow)</option>
                <option value="red">สีแดง (Red)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>SMI-V Category</label>
              <input type="text" name="smi_v" value={formData.smi_v} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>ความถี่ในการติดตาม *</label>
              <select name="followup_frequency" required value={formData.followup_frequency} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <option value="รายสัปดาห์">รายสัปดาห์</option>
                <option value="รายเดือน">รายเดือน</option>
                <option value="ราย 3 เดือน">ราย 3 เดือน</option>
                <option value="ราย 6 เดือน">ราย 6 เดือน</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>การรับประทานยา *</label>
              <select name="medication_status" required value={formData.medication_status} onChange={(e) => setFormData({...formData, medication_status: e.target.value === 'true'})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <option value="true">สม่ำเสมอ (รับยาครบ)</option>
                <option value="false">ขาดยา / ไม่สม่ำเสมอ</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>วันที่เยี่ยมบ้านล่าสุด</label>
              <input type="date" name="last_visit_date" value={formData.last_visit_date} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>สถานพยาบาลที่รับผิดชอบ</label>
              <select name="hospital_id" value={formData.hospital_id} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <option value="">-- ไม่ระบุ --</option>
                {clinics.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} /> ข้อมูลที่อยู่และพิกัดแผนที่ *
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <input type="text" name="address" placeholder="บ้านเลขที่, หมู่บ้าน, ซอย" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <input type="text" name="subdistrict" placeholder="ตำบล" value={formData.subdistrict} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              <input type="text" name="district" placeholder="อำเภอ" value={formData.district} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" name="province" placeholder="จังหวัด" value={formData.province} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                <button type="button" onClick={handleSearchAddress} disabled={loadingGeocode} className="btn-secondary" style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px', padding: '0 15px' }}>
                  <Search size={16} /> {loadingGeocode ? 'กำลังค้นหา...' : 'ค้นหาพิกัด'}
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>* กด "ค้นหาพิกัด" หรือคลิกบนแผนที่ด้านล่างเพื่อเลือกจุดที่ตั้งบ้าน</p>
            <LocationPickerMap position={position} setPosition={setPosition} />
            {position && (
              <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#2ecc71', fontWeight: '500' }}>
                ✓ เลือกพิกัดแล้ว: {position[0].toFixed(6)}, {position[1].toFixed(6)}
              </p>
            )}
          </div>

          {!isRestrictedRole && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>หมายเหตุเพิ่มเติม</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}></textarea>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>
              ยกเลิก
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
