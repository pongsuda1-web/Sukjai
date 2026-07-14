const fs = require('fs');

const nanHospital = { name: 'โรงพยาบาลน่าน', lat: 18.79552, lon: 100.78867 };

const amphoeCoords = {
    'เมืองน่าน': [18.7831, 100.7712],
    'แม่จริม': [18.718, 100.999],
    'บ้านหลวง': [18.847, 100.439],
    'นาน้อย': [18.324, 100.716],
    'ปัว': [19.176, 100.916],
    'ท่าวังผา': [19.109, 100.793],
    'เวียงสา': [18.577, 100.752],
    'ทุ่งช้าง': [19.412, 100.871],
    'เชียงกลาง': [19.296, 100.863],
    'นาหมื่น': [18.175, 100.676],
    'สันติสุข': [18.918, 100.939],
    'บ่อเกลือ': [19.148, 101.154],
    'สองแคว': [19.349, 100.702],
    'ภูเพียง': [18.761, 100.796],
    'เฉลิมพระเกียรติ': [19.577, 101.077]
};

const hospitals = [
    { name: 'โรงพยาบาลแม่จริม', amphoe: 'แม่จริม' },
    { name: 'โรงพยาบาลบ้านหลวง', amphoe: 'บ้านหลวง' },
    { name: 'โรงพยาบาลนาน้อย', amphoe: 'นาน้อย' },
    { name: 'โรงพยาบาลสมเด็จพระยุพราชปัว', amphoe: 'ปัว' },
    { name: 'โรงพยาบาลท่าวังผา', amphoe: 'ท่าวังผา' },
    { name: 'โรงพยาบาลเวียงสา', amphoe: 'เวียงสา' },
    { name: 'โรงพยาบาลทุ่งช้าง', amphoe: 'ทุ่งช้าง' },
    { name: 'โรงพยาบาลเชียงกลาง', amphoe: 'เชียงกลาง' },
    { name: 'โรงพยาบาลนาหมื่น', amphoe: 'นาหมื่น' },
    { name: 'โรงพยาบาลสันติสุข', amphoe: 'สันติสุข' },
    { name: 'โรงพยาบาลบ่อเกลือ', amphoe: 'บ่อเกลือ' },
    { name: 'โรงพยาบาลสองแคว', amphoe: 'สองแคว' },
    { name: 'โรงพยาบาลเฉลิมพระเกียรติ', amphoe: 'เฉลิมพระเกียรติ' },
    { name: 'โรงพยาบาลภูเพียง', amphoe: 'ภูเพียง' }
];

const rawPCU = fs.readFileSync('pcu_list.txt', 'utf-8');
const pcuLines = rawPCU.split('\n').filter(l => l.trim());

const pcusByAmphoe = {};
const seen = new Set();

for (let i = 0; i < pcuLines.length; i++) {
    const parts = pcuLines[i].split('\t');
    if (parts.length < 4) continue;
    let pcuName = parts[1].trim();
    const amphoe = parts[2].trim();
    
    if (pcuName.includes('บ้าน')) {
        pcuName = pcuName.split('บ้าน')[0].trim();
    }
    if (!pcuName.startsWith('รพ.สต.')) {
        pcuName = 'รพ.สต. ' + pcuName;
    }

    if (seen.has(pcuName)) continue;
    seen.add(pcuName);

    if (!pcusByAmphoe[amphoe]) pcusByAmphoe[amphoe] = [];
    pcusByAmphoe[amphoe].push(pcuName);
}

let sql = '';
sql += `-- =========================================\n`;
sql += `-- 1. ศูนย์กลาง: โรงพยาบาลน่าน\n`;
sql += `-- =========================================\n`;
sql += `INSERT INTO clinics (name, latitude, longitude) VALUES ('${nanHospital.name}', ${nanHospital.lat}, ${nanHospital.lon});\n\n`;

sql += `-- =========================================\n`;
sql += `-- 2. โรงพยาบาลชุมชน 14 อำเภอ\n`;
sql += `-- =========================================\n`;
for (const h of hospitals) {
    const coords = amphoeCoords[h.amphoe] || nanHospital.lat; // default to nan if missing
    sql += `INSERT INTO clinics (name, latitude, longitude) VALUES ('${h.name}', ${coords[0]}, ${coords[1]});\n`;
}
sql += '\n';

sql += `-- =========================================\n`;
sql += `-- 3. รพ.สต. ทั้งหมด (จัดเรียงไม่ซ้อนทับกัน)\n`;
sql += `-- =========================================\n`;

for (const amphoe in pcusByAmphoe) {
    const baseCoords = amphoeCoords[amphoe] || amphoeCoords['เมืองน่าน'];
    const pcus = pcusByAmphoe[amphoe];
    
    // Distribute PCUs in a circle around the Amphoe center so they don't overlap
    const radius = 0.02; // ~2km
    for (let i = 0; i < pcus.length; i++) {
        const angle = (i / pcus.length) * 2 * Math.PI;
        const lat = baseCoords[0] + radius * Math.cos(angle);
        const lon = baseCoords[1] + radius * Math.sin(angle);
        
        sql += `INSERT INTO clinics (name, latitude, longitude) VALUES ('${pcus[i]}', ${lat.toFixed(5)}, ${lon.toFixed(5)});\n`;
    }
}

fs.writeFileSync('insert_all_clinics_nan.sql', sql);
console.log('Done!');
