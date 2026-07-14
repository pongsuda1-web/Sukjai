const https = require('https');
const fs = require('fs');

const pcuses = [
    { name: 'รพ.สต.บ่อ', tambon: 'บ่อ' },
    { name: 'รพ.สต. สอบ่อ', tambon: 'บ่อ' },
    { name: 'รพ.สต.ผาสิงห์', tambon: 'ผาสิงห์' },
    { name: 'รพ.สต.ไชยสถาน', tambon: 'ไชยสถาน' },
    { name: 'รพ.สต.ถืมตอง', tambon: 'ถืมตอง' },
    { name: 'รพ.สต.เรือง', tambon: 'เรือง' },
    { name: 'รพ.สต.นาชาว', tambon: 'นาซาว' }, // Excel says นาชาว, but Tambon is นาซาว
    { name: 'รพ.สต.ดู่ใต้', tambon: 'ดู่ใต้' },
    { name: 'รพ.สต.กองควาย', tambon: 'กองควาย' },
    { name: 'รพ.สต.สวก', tambon: 'สวก' },
    { name: 'รพ.สต.สะเนียน', tambon: 'สะเนียน' }
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
                    if (parsed && parsed.length > 0) resolve([parsed[0].lat, parsed[0].lon]);
                    else resolve(null);
                } catch(e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
    let sql = '';
    const tambonCoords = {};
    for (const pcu of pcuses) {
        if (!tambonCoords[pcu.tambon]) {
            let coords = await geocode(`โรงพยาบาลส่งเสริมสุขภาพตำบล${pcu.tambon} อำเภอเมืองน่าน จังหวัดน่าน`);
            await sleep(1000);
            if (!coords) {
                coords = await geocode(`ตำบล${pcu.tambon} อำเภอเมืองน่าน จังหวัดน่าน`);
                await sleep(1000);
            }
            if (coords) {
                tambonCoords[pcu.tambon] = coords;
            } else {
                tambonCoords[pcu.tambon] = [18.7831, 100.7712]; // Fallback
            }
        }
        
        const coords = tambonCoords[pcu.tambon];
        // Add tiny offset for duplicate tambons
        const lat = parseFloat(coords[0]) + (Math.random() * 0.01 - 0.005);
        const lon = parseFloat(coords[1]) + (Math.random() * 0.01 - 0.005);
        
        sql += `UPDATE clinics SET latitude = ${lat.toFixed(5)}, longitude = ${lon.toFixed(5)} WHERE name = '${pcu.name}';\n`;
    }
    fs.writeFileSync('update_mueang.sql', sql);
    console.log('Done!');
}
main();
