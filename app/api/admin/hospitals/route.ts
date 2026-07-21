export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to check admin role (if needed via cookies, but we'll assume the frontend checks it for now)

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, lat, lng, address, phone, region, province, type } = data;
    
    const { data: newHospital, error } = await supabase
      .from('hospitals')
      .insert([{ name, lat: Number(lat), lng: Number(lng), address, phone, region, province, type }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ hospital: newHospital });
  } catch (error) {
    console.error('Error creating hospital:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, name, lat, lng, address, phone, region, province, type } = data;
    
    const { data: updated, error } = await supabase
      .from('hospitals')
      .update({ name, lat: Number(lat), lng: Number(lng), address, phone, region, province, type })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ hospital: updated });
  } catch (error) {
    console.error('Error updating hospital:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabase
      .from('hospitals')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hospital:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
