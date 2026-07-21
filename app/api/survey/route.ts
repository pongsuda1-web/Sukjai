export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { age, gender, occupation, satisfaction_score, how_known, expectations, is_helpful, feedback, assessment_scores } = body;

    const { error } = await supabase
      .from('survey_responses')
      .insert([{
        age: age || null, 
        gender: gender || null, 
        occupation: occupation || null, 
        satisfaction_score: satisfaction_score || null, 
        how_known: how_known || null,
        expectations: expectations || null,
        is_helpful: is_helpful || null,
        feedback: feedback || null, 
        assessment_scores: assessment_scores ? JSON.stringify(assessment_scores) : null
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in survey API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
