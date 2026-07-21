import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkContent } from '@/lib/moderation';

export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, author } = body;

    if (!title || !content || !author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Moderation Filter
    const titleCheck = checkContent(title);
    if (!titleCheck.isValid) {
      return NextResponse.json({ error: titleCheck.message, type: titleCheck.errorType }, { status: 400 });
    }

    const contentCheck = checkContent(content);
    if (!contentCheck.isValid) {
      return NextResponse.json({ error: contentCheck.message, type: contentCheck.errorType }, { status: 400 });
    }

    const authorCheck = checkContent(author);
    if (!authorCheck.isValid) {
      return NextResponse.json({ error: authorCheck.message, type: authorCheck.errorType }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, content, author }])
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
