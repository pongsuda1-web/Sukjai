const fs = require('fs');

const raw = fs.readFileSync('pcu_list.txt', 'utf-8');
const lines = raw.split('\n').filter(l => l.trim());

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

function main() {
    const results = [];
    const seen = new Set();
    // We add a tiny random offset so pins don't overlap completely
    for (let i = 0; i < lines.length; i++) {
        const parts = lines[i].split('\t');
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

        const baseCoords = amphoeCoords[amphoe] || [18.7831, 100.7712];
        const lat = baseCoords[0] + (Math.random() * 0.04 - 0.02);
        const lon = baseCoords[1] + (Math.random() * 0.04 - 0.02);
        
        const sql = `INSERT INTO clinics (name, latitude, longitude) VALUES ('${pcuName}', ${lat.toFixed(5)}, ${lon.toFixed(5)});`;
        results.push(sql);
    }
    
    fs.writeFileSync('insert_pcus.sql', results.join('\n'));
    console.log("Done! Written to insert_pcus.sql");
}

main();
