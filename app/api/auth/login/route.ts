import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from('admins')
      .select('id, username, role')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Set simple auth cookies
    const cookieStore = await cookies();
    cookieStore.set('admin_id', user.id.toString(), { path: '/', httpOnly: true });
    cookieStore.set('admin_role', user.role, { path: '/', httpOnly: true });
    cookieStore.set('admin_username', user.username, { path: '/', httpOnly: true });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
