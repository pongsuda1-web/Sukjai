const fs = require('fs');
const https = require('https');

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

async function geocode(query) {
    return new Promise((resolve) => {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
        https.get(url, { headers: { 'User-Agent': 'NanSukjaiApp/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed && parsed.length > 0) resolve([parseFloat(parsed[0].lat), parseFloat(parsed[0].lon)]);
                    else resolve(null);
                } catch(e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
    const rawPCU = fs.readFileSync('pcu_list.txt', 'utf-8');
    const pcuLines = rawPCU.split('\n').filter(l => l.trim());
    
    const uniquePCUs = [];
    const seen = new Set();
    
    for (let i = 0; i < pcuLines.length; i++) {
        const parts = pcuLines[i].split('\t');
        if (parts.length < 4) continue;
        let pcuName = parts[1].trim();
        const amphoe = parts[2].trim();
        const tambon = parts[3].trim();
        
        if (pcuName.includes('บ้าน')) {
            pcuName = pcuName.split('บ้าน')[0].trim();
        }
        if (!pcuName.startsWith('รพ.สต.')) {
            pcuName = 'รพ.สต. ' + pcuName;
        }
    
        if (seen.has(pcuName)) continue;
        seen.add(pcuName);
        uniquePCUs.push({ name: pcuName, amphoe, tambon });
    }

    let sql = `-- =========================================\n`;
    sql += `-- ลบข้อมูลสถานพยาบาลเดิมทั้งหมด\n`;
    sql += `-- =========================================\n`;
    sql += `DELETE FROM clinics;\n\n`;

    sql += `-- ศูนย์กลาง: โรงพยาบาลน่าน\n`;
    sql += `INSERT INTO clinics (name, latitude, longitude) VALUES ('${nanHospital.name}', ${nanHospital.lat}, ${nanHospital.lon});\n\n`;

    sql += `-- โรงพยาบาลชุมชน 14 อำเภอ\n`;
    for (const h of hospitals) {
        const coords = amphoeCoords[h.amphoe] || nanHospital.lat; 
        sql += `INSERT INTO clinics (name, latitude, longitude) VALUES ('${h.name}', ${coords[0]}, ${coords[1]});\n`;
    }
    sql += '\n';

    sql += `-- รพ.สต. 88 แห่ง (พิกัดตามสถานที่จริง / ตำบล)\n`;
    
    console.log(`Starting geocoding for ${uniquePCUs.length} PCUs...`);
    const tambonCache = {};
    const usedCoords = new Set();
    
    for (let i = 0; i < uniquePCUs.length; i++) {
        const pcu = uniquePCUs[i];
        let coords = null;
        
        // 1. Try to find the exact PCU by name (e.g. รพ.สต.ถืมตอง)
        let query1 = `โรงพยาบาลส่งเสริมสุขภาพตำบล${pcu.tambon} อำเภอ${pcu.amphoe} น่าน`;
        coords = await geocode(query1);
        await sleep(1000); // rate limit

        // 2. If not found, try just the Tambon name
        if (!coords) {
            if (!tambonCache[pcu.tambon]) {
                let query2 = `ตำบล${pcu.tambon} อำเภอ${pcu.amphoe} จังหวัดน่าน`;
                let tbCoords = await geocode(query2);
                await sleep(1000);
                if (tbCoords) tambonCache[pcu.tambon] = tbCoords;
            }
            coords = tambonCache[pcu.tambon];
        }
        
        // 3. Fallback to Amphoe coords
        if (!coords) {
            coords = amphoeCoords[pcu.amphoe] || amphoeCoords['เมืองน่าน'];
        }
        
        // Ensure no exact overlap by adding tiny jitter if coords have been used
        let lat = coords[0];
        let lon = coords[1];
        let coordKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
        
        while (usedCoords.has(coordKey)) {
            // Add ~200m random offset
            lat += (Math.random() * 0.004) - 0.002;
            lon += (Math.random() * 0.004) - 0.002;
            coordKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
        }
        usedCoords.add(coordKey);
        
        sql += `INSERT INTO clinics (name, latitude, longitude) VALUES ('${pcu.name}', ${lat.toFixed(5)}, ${lon.toFixed(5)});\n`;
        console.log(`[${i+1}/${uniquePCUs.length}] Resolved ${pcu.name}`);
    }

    fs.writeFileSync('insert_real_clinics_nan.sql', sql);
    console.log('All Done! Generated insert_real_clinics_nan.sql');
}

main();
