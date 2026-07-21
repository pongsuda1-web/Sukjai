export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: logs, error } = await supabase
      .from('diaries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching diaries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
