export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, event_data } = body;

    if (!event_type) {
      return NextResponse.json({ error: 'event_type is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('usage_logs')
      .insert([{
        event_type,
        event_data: event_data ? JSON.stringify(event_data) : null
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in tracking API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
