export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateDiaryReply } from '@/lib/replyGenerator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data: logs, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching diaries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, mood, note } = body;

    if (!user_id || !mood) {
      return NextResponse.json({ error: 'User ID and mood are required' }, { status: 400 });
    }

    const systemReply = generateDiaryReply(mood, note || '');

    const { data, error } = await supabase
      .from('diaries')
      .insert([
        { user_id, mood, note: note || null, system_reply: systemReply }
      ])
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('Error in diary API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
