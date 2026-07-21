'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, Map, Phone, BookOpen, ClipboardList, Beaker, MessageSquare, BookText, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'หน้าหลัก', href: '/', icon: <HeartPulse size={20} /> },
    { name: 'สถานพยาบาล', href: '/map', icon: <Map size={20} /> },
    { name: 'สายด่วน', href: '/hotlines', icon: <Phone size={20} /> },
    { name: 'คลังความรู้', href: '/resources', icon: <BookOpen size={20} /> },
    { name: 'แบบประเมิน', href: '/assessments', icon: <ClipboardList size={20} /> },
    { name: 'ไดอารี่', href: '/diary', icon: <BookText size={20} /> },
  ];

  return (
    <nav className="navbar" style={{ background: 'var(--color-surface)', borderBottom: '2px solid var(--color-primary-light)', padding: '0.5rem 0' }}>
      <div className="navbar-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link href="/" className="navbar-logo" style={{ color: 'var(--color-primary-dark)', gap: '0.75rem' }}>
            <img src="/images/dog_mascot.jpg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary-light)' }} />
            <span style={{ fontWeight: '700', fontSize: '1.3rem' }}>NAN Sukjai</span>
          </Link>
          
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
          <Link href="/community" className={`nav-link ${pathname.includes('/community') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <MessageSquare size={20} />
            <span>เว็บบอร์ด</span>
          </Link>
          <Link href="/research" className="btn btn-outline nav-btn-research" onClick={() => setIsMobileMenuOpen(false)}>
            <Beaker size={20} />
            <span>เข้าร่วมงานวิจัย</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
