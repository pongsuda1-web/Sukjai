'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, use } from 'react';
import { assessments } from '../../../data/mockData';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const assessment = assessments.find(a => a.id === unwrappedParams.id);
  
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<{ result: string, recommendation: string } | null>(null);
  const [isFading, setIsFading] = useState(false);

  if (!assessment) return <div>ไม่พบแบบประเมิน</div>;

  const questions = assessment.questions;
  const currentQuestion = questions[currentQuestionIndex];
  // Calculate progress ensuring it's 100% when at the end
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

  const handleSelect = (questionId: string, score: number) => {
    // Record answer
    const newAnswers = { ...answers, [questionId]: score };
    setAnswers(newAnswers);
    
    // Auto advance after short delay
    setIsFading(true);
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        calculateScore(newAnswers);
      }
      setIsFading(false);
    }, 400);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setIsFading(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev - 1);
        setIsFading(false);
      }, 250);
    } else {
      router.back();
    }
  };

  const calculateScore = (finalAnswers: Record<string, number>) => {
    const total = Object.values(finalAnswers).reduce((acc, curr) => acc + curr, 0);
    const interpret = assessment.interpretations.find(i => total >= i.min && total <= i.max);
    if (interpret) {
      setResult({ result: interpret.result, recommendation: interpret.recommendation });
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header & Back Button */}
      {!result && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={handleBack} className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'transparent', boxShadow: 'none', color: 'var(--color-primary-dark)' }}>
            <ArrowLeft size={20} /> ย้อนกลับ
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="glass-panel" style={{ padding: '3rem 2.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        
        {!result ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>
            
            {/* Title & Progress */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                {assessment.title}
              </h1>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem', color: 'var(--color-text-muted)' }}>
                <span>ความคืบหน้า</span>
                <span>{currentQuestionIndex + 1} / {questions.length}</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${progressPercentage}%`, 
                  height: '100%', 
                  background: 'var(--color-primary)', 
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}></div>
              </div>
            </div>

            {/* Question Area */}
            <div style={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              opacity: isFading ? 0 : 1,
              transform: isFading ? 'translateY(15px)' : 'translateY(0)',
              transition: 'opacity 0.3s ease, transform 0.3s ease'
            }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '2.5rem', textAlign: 'center', lineHeight: '1.5' }}>
                {currentQuestion.text}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = answers[currentQuestion.id] === opt.score;
                  return (
                    <button 
                      key={i}
                      onClick={() => handleSelect(currentQuestion.id, opt.score)}
                      style={{ 
                        padding: '1.25rem', 
                        background: isSelected ? 'var(--color-primary)' : 'white', 
                        border: isSelected ? '2px solid var(--color-primary)' : '2px solid #e2e8f0',
                        borderRadius: 'var(--radius-lg)', 
                        fontSize: '1.15rem',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        color: isSelected ? 'white' : 'var(--color-text)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--color-primary)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                        }
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0', animation: 'fadeIn 0.6s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <CheckCircle2 size={72} style={{ color: 'var(--color-secondary)' }} />
            </div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', fontWeight: 'bold' }}>ประเมินเสร็จสิ้น</h2>
            <div style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', padding: '1.5rem 3rem', borderRadius: 'var(--radius-lg)', display: 'inline-block', marginBottom: '2.5rem', fontWeight: 'bold', fontSize: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
              {result.result}
            </div>
            <div style={{ fontSize: '1.25rem', marginBottom: '3rem', background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', lineHeight: '1.6', textAlign: 'left', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <strong style={{ color: 'var(--color-primary-dark)', fontSize: '1.3rem' }}>💡 คำแนะนำ: </strong><br/>
              <span style={{ marginTop: '0.5rem', display: 'inline-block' }}>{result.recommendation}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setAnswers({}); setResult(null); setCurrentQuestionIndex(0); }} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}>ทำแบบประเมินอีกครั้ง</button>
              <button onClick={() => router.push('/hotlines')} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}>ดูสายด่วนสุขภาพจิต</button>
              <button onClick={() => router.push('/')} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}>กลับหน้าหลัก</button>
            </div>
          </div>
        )}
      </div>
      
      {/* Global Style for fade in */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
