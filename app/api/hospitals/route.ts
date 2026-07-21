export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: hospitals, error } = await supabase.from('hospitals').select('*');
    if (error) throw error;
    
    return NextResponse.json(hospitals, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch hospitals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
