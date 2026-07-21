import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const id = cookieStore.get('admin_id')?.value;
    const role = cookieStore.get('admin_role')?.value;
    const username = cookieStore.get('admin_username')?.value;

    if (!id || !role || !username) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: { id: parseInt(id), role, username }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
