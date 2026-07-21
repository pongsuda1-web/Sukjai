// Content Moderation Logic
export function checkContent(text: string): { isValid: boolean; errorType?: 'profanity' | 'self_harm'; message?: string } {
  if (!text) return { isValid: true };

  const lowerText = text.toLowerCase();

  // 1. Self-Harm Filter
  const selfHarmKeywords = ['ฆ่าตัวตาย', 'อยากตาย', 'กรีดข้อมือ', 'ทำร้ายตัวเอง', 'ไม่อยากอยู่แล้ว', 'ตายๆไป', 'ผูกคอ', 'กระโดดตึก', 'กินยาตาย'];
  for (const word of selfHarmKeywords) {
    if (lowerText.includes(word)) {
      return { 
        isValid: false, 
        errorType: 'self_harm',
        message: 'ระบบตรวจพบเนื้อหาที่อาจสื่อถึงการทำร้ายตนเอง หากคุณกำลังรู้สึกสิ้นหวัง หรือต้องการใครสักคนรับฟัง โปรดติดต่อสายด่วน 1323 (กรมสุขภาพจิต) ตลอด 24 ชั่วโมง เราพร้อมรับฟังคุณเสมอ' 
      };
    }
  }

  // 2. Profanity Filter (Mock list)
  const profanityKeywords = ['ไอ้สัส', 'เหี้ย', 'ควย', 'หี', 'แตด', 'แม่ง', 'ส้นตีน', 'เย็ด'];
  for (const word of profanityKeywords) {
    if (lowerText.includes(word)) {
      return { 
        isValid: false, 
        errorType: 'profanity',
        message: 'กรุณาใช้ถ้อยคำที่สุภาพในการสนทนา เพื่อรักษาบรรยากาศพื้นที่ปลอดภัยของทุกคน' 
      };
    }
  }

  return { isValid: true };
}
