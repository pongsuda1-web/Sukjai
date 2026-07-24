'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldAlert } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'สวัสดีค่ะ ฉันคือ "น้องน่านสุขใจ" 🌻 บอทผู้ช่วยรับฟังและให้กำลังใจ คุณมีเรื่องอะไรไม่สบายใจ หรืออยากระบายให้ฟัง พิมพ์มาได้เลยนะคะ (พื้นที่นี้เป็นความลับค่ะ)'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });

      if (res.ok) {
        const data = await res.json();
        const botMessage: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: data.reply };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Bot size={32} className="text-primary" /> คุยกับน้องน่านสุขใจ (AI)
        </h1>
        <p className="text-muted">พื้นที่ปลอดภัยสำหรับระบายความรู้สึก</p>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        
        {/* Warning Banner */}
        <div style={{ background: '#fffbeb', padding: '0.75rem', fontSize: '0.85rem', color: '#b45309', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', borderBottom: '1px solid #fde68a' }}>
          <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0 }}>
            น้องน่านสุขใจเป็นเพียงระบบ AI ให้คำปรึกษาเบื้องต้น ไม่สามารถทดแทนการรักษาโดยแพทย์ได้ หากมีความคิดอยากทำร้ายตัวเอง กรุณาโทร 1323 (สายด่วนสุขภาพจิต) หรือ 191 ทันที
          </p>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              alignItems: 'flex-end',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
              maxWidth: '85%'
            }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: msg.sender === 'bot' ? 'var(--color-primary-light)' : 'var(--color-secondary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: msg.sender === 'bot' ? 'var(--color-primary-dark)' : 'var(--color-secondary-dark)'
              }}>
                {msg.sender === 'bot' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                borderBottomLeftRadius: msg.sender === 'bot' ? '0' : '1rem',
                borderBottomRightRadius: msg.sender === 'user' ? '0' : '1rem',
                background: msg.sender === 'bot' ? 'white' : 'var(--color-primary)',
                color: msg.sender === 'bot' ? 'var(--color-text)' : 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                lineHeight: '1.5'
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', alignSelf: 'flex-start' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--color-primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-dark)'
              }}>
                <Bot size={18} />
              </div>
              <div style={{
                padding: '0.75rem 1rem', borderRadius: '1rem', borderBottomLeftRadius: '0',
                background: 'white', color: 'var(--color-text-muted)'
              }}>
                กำลังพิมพ์...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} style={{ padding: '1rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์ข้อความที่นี่..."
            style={{ 
              flex: 1, padding: '0.75rem 1rem', borderRadius: '2rem', border: '1px solid #cbd5e1', 
              outline: 'none', fontSize: '1rem'
            }}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            style={{ 
              width: '46px', height: '46px', borderRadius: '50%', background: 'var(--color-primary)', 
              color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: (!input.trim() || isTyping) ? 'not-allowed' : 'pointer',
              opacity: (!input.trim() || isTyping) ? 0.6 : 1
            }}
          >
            <Send size={20} style={{ marginLeft: '4px' }} />
          </button>
        </form>
      </div>

    </div>
  );
}
