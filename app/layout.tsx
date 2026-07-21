import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'NAN Sukjai (น่านสุขใจ) - บริการให้คำปรึกษาทางด้านจิตใจ',
  description: 'แพลตฟอร์มรวบรวมแหล่งความช่วยเหลือ ให้คำปรึกษาทางด้านจิตใจ ค้นหาสถานพยาบาลใกล้เคียง และแบบประเมินสุขภาพจิตเบื้องต้น',
  keywords: 'สุขภาพจิต, ซึมเศร้า, ให้คำปรึกษา, สายด่วนสุขภาพจิต, คลินิกจิตเวช, สุขใจ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
