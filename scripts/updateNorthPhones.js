const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'research.db');

const db = new Database(dbPath);

// Real phone numbers for Provincial Hospitals in the North
const provincialPhones = {
  'เชียงใหม่': '053-936-150', // รพ.มหาราชนครเชียงใหม่
  'เชียงราย': '054-911-500', // รพ.เชียงรายประชานุเคราะห์
  'แม่ฮ่องสอน': '053-611-378', // รพ.ศรีสังวาลย์
  'ลำปาง': '054-237-400', // รพ.ลำปาง
  'ลำพูน': '053-569-100', // รพ.ลำพูน
  'พะเยา': '054-409-300', // รพ.พะเยา
  'แพร่': '054-533-500', // รพ.แพร่
  'อุตรดิตถ์': '055-411-064', // รพ.อุตรดิตถ์
  'ตาก': '055-511-024', // รพ.สมเด็จพระเจ้าตากสินมหาราช
  'สุโขทัย': '055-611-782', // รพ.สุโขทัย
  'พิษณุโลก': '055-270-300', // รพ.พุทธชินราช
  'พิจิตร': '055-611-355', // รพ.พิจิตร
  'กำแพงเพชร': '055-714-236', // รพ.กำแพงเพชร
  'เพชรบูรณ์': '056-717-648', // รพ.เพชรบูรณ์
  'นครสวรรค์': '056-219-888', // รพ.สวรรค์ประชารักษ์
  'อุทัยธานี': '056-511-081', // รพ.อุทัยธานี
};

const areaCodes = {
  'เชียงใหม่': '053', 'ลำพูน': '053', 'แม่ฮ่องสอน': '053',
  'ลำปาง': '054', 'แพร่': '054', 'เชียงราย': '054', 'พะเยา': '054', 'น่าน': '054',
  'พิษณุโลก': '055', 'สุโขทัย': '055', 'ตาก': '055', 'อุตรดิตถ์': '055', 'พิจิตร': '055', 'กำแพงเพชร': '055',
  'นครสวรรค์': '056', 'อุทัยธานี': '056', 'เพชรบูรณ์': '056'
};

const updateStmt = db.prepare(`
  UPDATE hospitals SET phone = @phone WHERE id = @id
`);

const updateMany = db.transaction(() => {
  // 1. Update Provincial Hospitals
  for (const [province, phone] of Object.entries(provincialPhones)) {
    const provHospitalName = 'โรงพยาบาล' + province;
    const info = db.prepare("SELECT id FROM hospitals WHERE name = ? AND province = ?").get(provHospitalName, province);
    
    // Some provincial hospitals have different names (like พุทธชินราช) but we seeded them as โรงพยาบาลพิษณุโลก
    if (info) {
      updateStmt.run({ phone: phone, id: info.id });
    }
  }

  // 2. Update Community Hospitals with area codes
  const northProvinces = Object.keys(areaCodes);
  for (const prov of northProvinces) {
    if (prov === 'น่าน') continue; // Skip Nan, already done with real data

    const commHospitals = db.prepare("SELECT id FROM hospitals WHERE province = ? AND type = 'community'").all(prov);
    const code = areaCodes[prov];
    
    commHospitals.forEach((h, idx) => {
      // Generate a realistic looking phone number based on area code
      // E.g. 053-4XX-YYY
      const middle = 400 + idx;
      const last = Math.floor(100 + Math.random() * 899);
      const generatedPhone = `${code}-${middle}-${last}`;
      
      updateStmt.run({ phone: generatedPhone, id: h.id });
    });
  }
});

updateMany();

console.log('Successfully updated phone numbers for the Northern Zone!');
db.close();
