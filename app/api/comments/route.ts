import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkContent } from '@/lib/moderation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { post_id, content, author, is_admin } = body;

    if (!post_id || !content || !author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Moderation Filter
    const contentCheck = checkContent(content);
    if (!contentCheck.isValid) {
      return NextResponse.json({ error: contentCheck.message, type: contentCheck.errorType }, { status: 400 });
    }

    const authorCheck = checkContent(author);
    if (!authorCheck.isValid) {
      return NextResponse.json({ error: authorCheck.message, type: authorCheck.errorType }, { status: 400 });
    }

    const { error } = await supabase
      .from('comments')
      .insert([{
        post_id,
        content,
        author,
        is_admin: is_admin ? true : false
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
