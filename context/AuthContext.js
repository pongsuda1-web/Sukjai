"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

const DEMO_USERS = [
  { username: 'admin', password: 'admin123', name: 'ผู้ดูแลระบบ', role: 'admin' },
  { username: 'doctor1', password: 'doc2023', name: 'คุณหมอสุข', role: 'doctor' },
  { username: 'jhw01', password: 'jhwpass', name: 'อสม. สมหมาย', role: 'jhw' }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for logged in user on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    // Setup demo users if not present
    if (!localStorage.getItem('approvedUsers')) {
      localStorage.setItem('approvedUsers', JSON.stringify(DEMO_USERS));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Basic route protection
    if (!loading) {
      if (!currentUser && pathname !== '/login') {
        router.push('/login');
      } else if (currentUser && pathname === '/login') {
        router.push('/');
      }
    }
  }, [currentUser, loading, pathname, router]);

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
    const matched = users.find(u => u.username === username && u.password === password);
    if (matched) {
      const userData = { username: matched.username, name: matched.name, role: matched.role };
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setCurrentUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
