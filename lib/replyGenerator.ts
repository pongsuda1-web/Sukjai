export function generateDiaryReply(mood: string, note: string | null): string | null {
  if (!note && !mood) return null;
  const text = note ? note.toLowerCase() : '';
  const prefix = 'น้องน่านสุขใจ 💖 : ';

  // 1. Emergency Check
  const emergencyKeywords = ['ตาย', 'อยากตาย', 'ไม่ไหวแล้ว', 'ไม่อยากอยู่', 'ฆ่าตัว', 'เหนื่อยกับชีวิต'];
  if (emergencyKeywords.some(kw => text.includes(kw))) {
    return `${prefix}น้องน่านสุขใจสัมผัสได้ว่าตอนนี้คุณกำลังเผชิญกับเรื่องที่หนักหนามากๆ เลยนะคะ... ไม่เป็นไรนะที่คุณจะรู้สึกเหนื่อยจนไม่อยากไปต่อ แต่อยากให้รู้ไว้ว่าคุณไม่ได้อยู่ตัวคนเดียวนะคะ หากตอนนี้รู้สึกไม่ไหวจริงๆ น้องน่านสุขใจขอร้องให้คุณลองโทรพูดคุยกับพี่ๆ ที่สายด่วน 1323 (ฟรี ตลอด 24 ชม.) ก่อนนะคะ พวกเขารับฟังและช่วยบรรเทาความเจ็บปวดนี้ได้แน่นอนค่ะ กอดแน่นๆ นะคะ 🫂`;
  }

  // 2. Contextual Check
  if (text.includes('งาน') || text.includes('ทำงาน') || text.includes('หัวหน้า') || text.includes('ลูกค้า')) {
    if (['tired', 'burnout', 'anxious', 'annoyed', 'angry'].includes(mood)) {
      return `${prefix}เรื่องงานวันนี้คงจะหนักและสูบพลังไปเยอะเลยใช่ไหมคะ? เก่งมากๆ แล้วค่ะที่สู้มาได้จนจบวัน ตอนนี้วางทุกอย่างลง แล้วอนุญาตให้ตัวเองได้พักผ่อนทั้งกายและใจนะคะ พรุ่งนี้ค่อยเริ่มต้นใหม่ค่ะ 🍵`;
    }
  }
  if (text.includes('สอบ') || text.includes('เรียน') || text.includes('เกรด')) {
    if (['anxious', 'sad', 'disappointed', 'tired'].includes(mood)) {
      return `${prefix}เรื่องเรียนหรือเรื่องสอบมันกดดันมากๆ เลยเนอะ น้องน่านสุขใจเข้าใจเลยค่ะ ไม่ว่าผลจะเป็นยังไง ความตั้งใจที่คุณทำไปมันมีค่าเสมอนะคะ อย่าเพิ่งกดดันตัวเองมากเกินไปน้า หายใจลึกๆ แล้วพักสมองหน่อยนะคะ 📚`;
    }
  }
  if (text.includes('อกหัก') || text.includes('เลิก') || text.includes('แฟน') || text.includes('คนคุย') || text.includes('ความรัก')) {
    if (['sad', 'lonely', 'hurt', 'despair', 'empty'].includes(mood)) {
      return `${prefix}ความสัมพันธ์ที่ทำให้เราเสียใจ มันเหมือนโลกพังทลายเลยใช่ไหมคะ... ร้องไห้ได้เต็มที่เลยนะคะ ปล่อยมันออกมา น้องน่านสุขใจจะนั่งอยู่ตรงนี้เป็นเพื่อนคุณเองค่ะ เวลาจะช่วยเยียวยาหัวใจที่แตกสลายของคุณเองนะคะ 🩹`;
    }
  }

  // 3. Mood-based fallback
  const positiveMoods = ['overjoyed', 'inlove', 'excited', 'happy', 'grateful', 'proud', 'calm', 'relieved'];
  if (positiveMoods.includes(mood)) {
    return `${prefix}ดีใจจังเลยค่ะที่วันนี้เป็นวันที่ดีสำหรับคุณ! ความรู้สึกดีๆ แบบนี้ควรค่าแก่การเก็บรักษาไว้ในความทรงจำนะคะ ขอให้พรุ่งนี้เป็นอีกวันที่น่ารักสำหรับคุณค่ะ ✨`;
  }

  const lowEnergyMoods = ['neutral', 'bored', 'tired', 'burnout', 'sleepy', 'empty'];
  if (lowEnergyMoods.includes(mood)) {
    return `${prefix}วันนี้อาจจะเป็นวันที่เรื่อยๆ หรือโดนดูดพลังไปบ้าง ไม่เป็นไรเลยค่ะ ร่างกายและจิตใจของเราต้องการการชาร์จแบตเหมือนกัน คืนนี้ขดตัวในผ้าห่มอุ่นๆ แล้วนอนหลับให้เต็มอิ่มนะคะ 🛌💤`;
  }

  const negativeMoods = ['anxious', 'annoyed', 'sad', 'angry', 'confused', 'lonely', 'hurt', 'guilty', 'disappointed', 'despair', 'shy', 'surprised'];
  if (negativeMoods.includes(mood)) {
    return `${prefix}รับรู้ได้เลยว่าวันนี้มีเรื่องให้กวนใจหรือทำให้รู้สึกแย่... กอดแน่นๆ นะคะ อนุญาตให้ตัวเองอ่อนแอได้ โกรธได้ เศร้าได้ มันคือเรื่องปกติของมนุษย์ค่ะ พรุ่งนี้เราค่อยเริ่มใหม่ในแบบของเรานะคะ 🌻`;
  }

  return `${prefix}ขอบคุณที่แวะมาบันทึกเรื่องราวในวันนี้นะคะ น้องน่านสุขใจจะเป็นพื้นที่ปลอดภัยให้คุณเสมอค่ะ 💙`;
}
