import { NextResponse } from 'next/server';

// Basic Rule-based Chatbot Logic (CBT style)
export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Delay to simulate typing
    await new Promise(resolve => setTimeout(resolve, 1000));

    let reply = "";
    const msg = message.toLowerCase();

    // Simple heuristic keyword matching
    if (msg.includes('เครียด') || msg.includes('เหนื่อย') || msg.includes('ท้อ')) {
      reply = "ฟังดูเหมือนคุณกำลังแบกรับความรู้สึกหนักๆ อยู่เลยนะคะ 🫂 คุณเก่งมากแล้วที่พยายามผ่านมาจนถึงตอนนี้ อยากเล่าให้ฟังเพิ่มเติมไหมคะว่าเรื่องอะไรที่ทำให้รู้สึกหนักใจที่สุด?";
    } else if (msg.includes('เศร้า') || msg.includes('ร้องไห้') || msg.includes('เสียใจ')) {
      reply = "ความเสียใจเป็นเรื่องธรรมชาตินะคะ อนุญาตให้ตัวเองเศร้าได้เต็มที่เลย การร้องไห้ก็เป็นการระบายอย่างหนึ่งค่ะ ตอนนี้พอจะมีใครสักคนที่คุณไว้ใจให้กอดหรือรับฟังไหมคะ?";
    } else if (msg.includes('เหงา') || msg.includes('ไม่มีใคร')) {
      reply = "ความเหงาเป็นความรู้สึกที่ทำให้เราเคว้งคว้างได้ง่ายๆ แต่คุณไม่ได้อยู่คนเดียวนะคะ น้องใจดีอยู่ตรงนี้พร้อมรับฟังเสมอ ลองหากิจกรรมเล็กๆ ที่ชอบทำเพื่อดึงความสนใจกลับมาที่ตัวเองดูไหมคะ?";
    } else if (msg.includes('แพนิค') || msg.includes('ใจสั่น') || msg.includes('กลัว')) {
      reply = "ดูเหมือนคุณกำลังกังวลหรือตื่นตระหนกนะคะ หายใจเข้าลึกๆ ช้าๆ 4 วินาที กลั้นไว้ 7 วินาที แล้วค่อยๆ พ่นออก 8 วินาทีนะคะ... มันคืออาการแพนิค เดี๋ยวมันก็ผ่านไปค่ะ คุณปลอดภัยนะคะ 🌿";
    } else if (msg.includes('โกรธ') || msg.includes('หงุดหงิด') || msg.includes('โมโห')) {
      reply = "เข้าใจเลยค่ะว่าสถานการณ์นั้นน่าโมโหแค่ไหน ความโกรธบอกให้เรารู้ว่ามีบางอย่างล้ำเส้นเรา ลองเขียนระบายใส่กระดาษแล้วฉีกทิ้ง หรือไปใช้กล่องระเบิดอารมณ์ในหน้า 'ฮีลใจด่วน' ดูไหมคะ?";
    } else if (msg.includes('อยากตาย') || msg.includes('ไม่อยากอยู่')) {
      reply = "น้องใจดีอยากบอกว่า ชีวิตของคุณมีค่ามากๆ นะคะ 🥺 หากคุณกำลังรู้สึกไม่ไหวจริงๆ อยากให้ลองโทรปรึกษาสายด่วน 1323 (ฟรี ตลอด 24 ชม.) หรือติดต่อคนใกล้ชิดทันทีนะคะ ขอให้เชื่อว่ายังมีทางออกและมีคนที่พร้อมช่วยเหลือคุณเสมอค่ะ";
    } else {
      const genericReplies = [
        "ขอบคุณที่แชร์เรื่องราวให้ฟังนะคะ น้องใจดีรับฟังอยู่นะ อยากเล่าอะไรเพิ่มไหมคะ?",
        "ความรู้สึกของคุณตอนนี้เป็นเรื่องปกตินะคะ ไม่ผิดเลยที่คุณจะรู้สึกแบบนั้น",
        "บางครั้งการได้ระบายออกมาก็ช่วยให้ใจเบาขึ้นได้ค่ะ มีอะไรอยากเล่าต่อนอกเหนือจากนี้ไหมคะ?",
        "คุณเก่งมากแล้วที่กล้าเผชิญหน้ากับความรู้สึกของตัวเอง น้องใจดีเป็นกำลังใจให้นะคะ 💖"
      ];
      reply = genericReplies[Math.floor(Math.random() * genericReplies.length)];
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
