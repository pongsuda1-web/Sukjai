export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

async function checkAdminRole() {
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value;
  return role === 'admin';
}

export async function GET() {
  if (!(await checkAdminRole())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  
  const { data: staff, error } = await supabase
    .from('admins')
    .select('id, username, role, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Database Error' }, { status: 500 });

  return NextResponse.json({ staff });
}

export async function POST(request: Request) {
  if (!(await checkAdminRole())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { username, password } = await request.json();
    if (!username || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const { data, error } = await supabase
      .from('admins')
      .insert([{ username, password, role: 'assistant' }])
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') { // Postgres unique violation
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await checkAdminRole())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { data, error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id)
      .eq('role', 'assistant')
      .select('id');

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Not found or cannot delete root admin' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
