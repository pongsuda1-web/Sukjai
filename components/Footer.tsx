import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Dr.Pongsuda (NAN Sukjai). All rights reserved.</p>
        <p className="footer-disclaimer">ข้อมูลบนเว็บไซต์นี้จัดทำขึ้นเพื่อการให้คำปรึกษาเบื้องต้น ไม่สามารถทดแทนการวินิจฉัยโดยแพทย์ผู้เชี่ยวชาญ หากมีภาวะฉุกเฉิน โปรดติดต่อสายด่วน 1323 หรือ 1669</p>
      </div>
    </footer>
  );
}
