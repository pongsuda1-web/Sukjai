const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'research.db');

const nanPhones = {
  'โรงพยาบาลน่าน': '054-719-000',
  'โรงพยาบาลเวียงสา': '054-781-329',
  'โรงพยาบาลปัว': '054-791-104', // Also known as สมเด็จพระยุพราชปัว
  'โรงพยาบาลท่าวังผา': '054-799-031',
  'โรงพยาบาลสองแคว': '054-793-013',
  'โรงพยาบาลทุ่งช้าง': '054-795-207',
  'โรงพยาบาลเชียงกลาง': '054-797-040',
  'โรงพยาบาลเฉลิมพระเกียรติ': '054-733-516',
  'โรงพยาบาลนาน้อย': '054-789-082',
  'โรงพยาบาลนาหมื่น': '054-787-046',
  'โรงพยาบาลบ้านหลวง': '054-794-067',
  'โรงพยาบาลบ่อเกลือ': '054-778-064',
  'โรงพยาบาลแม่จริม': '054-779-052',
  'โรงพยาบาลภูเพียง': '054-718-200',
  'โรงพยาบาลสันติสุข': '054-776-027'
};

const db = new Database(dbPath);

const updateStmt = db.prepare(`
  UPDATE hospitals SET phone = @phone WHERE name = @name AND province = 'น่าน'
`);

const updateMany = db.transaction((items) => {
  for (const [name, phone] of items) {
    // In our DB, "โรงพยาบาลปัว" might be named "โรงพยาบาลปัว" based on the district name.
    updateStmt.run({ name, phone });
  }
});

updateMany(Object.entries(nanPhones));

console.log('Successfully updated phone numbers for hospitals in Nan province.');
db.close();
