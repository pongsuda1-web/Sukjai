"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '../utils/supabase/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    // 1. Initial Session Check
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    };

    fetchSession();

    // 2. Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (user) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
      }
      
      if (data) {
        setCurrentUser({
          id: user.id,
          email: user.email,
          name: data.full_name || user.email || 'LINE User',
          role: data.role || 'jhw'
        });
      } else {
        // Auto-create profile for OAuth users (e.g. LINE) if missing
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'LINE User',
          username: user.email || user.id,
          role: 'jhw',
          is_approved: false
        };
        await supabase.from('profiles').insert([newProfile]);
        
        setCurrentUser({
          id: user.id,
          email: user.email,
          name: newProfile.full_name,
          role: 'jhw'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Basic route protection
    if (!loading) {
      if (!currentUser && pathname !== '/login' && pathname !== '/register') {
        router.push('/login');
      } else if (currentUser && (pathname === '/login' || pathname === '/register')) {
        router.push('/');
      }
    }
  }, [currentUser, loading, pathname, router]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login Error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const register = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error("Register Error:", error);
      return { success: false, error: error.message };
    }
    
    // Create profile if successful
    if (data?.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: data.user.id, full_name: fullName, username: email, role: 'jhw', is_approved: false }
      ]);
      if (profileError) console.error("Error creating profile:", profileError);
    }
    
    return { success: true };
  };

  const loginWithLine = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'line',
      options: {
        redirectTo: `${window.location.origin}/`,
      }
    });
    
    if (error) {
      console.error("LINE Login Error:", error);
      return { success: false, error: error.message };
    }
    // Note: Profile creation for LINE users will happen automatically via a Supabase trigger,
    // or we can handle it in the fetchSession if the profile doesn't exist.
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, loginWithLine, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
