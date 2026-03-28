'use client';
import { useState } from 'react';
import { RESPONSE_SCENARIOS } from '@/lib/scenarios';
import { PHRASES } from '@/lib/phrases';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Activity, Eye, Play, User, Loader2, ChevronRight } from 'lucide-react';

export default function TrainingMode() {
    const [tab, setTab] = useState('scenarios');

    // Scenario mode state
    const [sIdx, setSIdx] = useState(0);
    const [response, setResponse] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const current = RESPONSE_SCENARIOS[sIdx];

    // Phrase mode state
    const [pIdx, setPIdx] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const phrase = PHRASES[pIdx];

    const submitResponse = async (e) => {
        e.preventDefault();
        if (!response.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario: current, userResponse: response, mode: 'response' })
            });
            setFeedback(await res.json());
        } catch {
            setFeedback({ scores: {}, feedback: 'Connection error.', totalScore: 0 });
        } finally {
            setIsSubmitting(false);
        }
    };

    const Tab = ({ id, icon, label }) => (
        <button
            onClick={() => setTab(id)}
            style={{
                flex: 1, padding: '12px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', transition: 'all 0.2s', fontSize: '0.9rem', fontWeight: tab === id ? '600' : '400',
                background: tab === id ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: tab === id ? '#fff' : 'var(--text-muted)'
            }}
        >
            {icon} {label}
        </button>
    );

    return (
        <main className="main-content container animate-fade-in">
            <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Practice Mode</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Low pressure. Build your vocabulary and response instincts without affecting your readiness score.
                    </p>
                </div>

                {/* Tab bar */}
                <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '14px', padding: '6px', marginBottom: '28px', border: '1px solid var(--border-color)', gap: '4px' }}>
                    <Tab id="scenarios" icon={<Activity size={16} />} label="Scenario Practice" />
                    <Tab id="phrases" icon={<BookOpen size={16} />} label="Phrase Drill" />
                </div>

                <AnimatePresence mode="wait">
                    {tab === 'scenarios' && (
                        <motion.div key="sc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="glass-card" style={{ padding: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '600', textTransform: 'uppercase' }}>{current.category}</span>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{current.setting} · <span style={{ color: current.difficulty === 'Hard' || current.difficulty === 'Very Hard' ? 'var(--danger)' : 'var(--warning)' }}>{current.difficulty}</span></p>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sIdx + 1}/{RESPONSE_SCENARIOS.length}</span>
                                </div>

                                {current.background && (
                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid var(--accent-secondary)', padding: '14px 18px', borderRadius: '4px 12px 12px 4px', marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                                        <strong style={{ color: '#fff' }}>Context: </strong> {current.background}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '18px' }}>👤</div>
                                    <div style={{ background: 'var(--bg-secondary)', padding: '14px 18px', borderRadius: '4px 16px 16px 16px', fontSize: '1.1rem', lineHeight: '1.5', flex: 1 }}>
                                        "{current.patientSays}"
                                    </div>
                                </div>

                                <form onSubmit={submitResponse}>
                                    <textarea
                                        value={response}
                                        onChange={e => setResponse(e.target.value)}
                                        placeholder="What would you say?"
                                        disabled={isSubmitting || !!feedback}
                                        rows={3}
                                        style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '0.95rem', resize: 'none', outline: 'none', fontFamily: 'inherit', marginBottom: '12px' }}
                                    />
                                    {!feedback && (
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button type="submit" className="btn-primary" disabled={!response.trim() || isSubmitting} style={{ opacity: !response.trim() ? 0.5 : 1 }}>
                                                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Evaluating...</> : 'Get Feedback'}
                                            </button>
                                        </div>
                                    )}
                                </form>

                                {feedback && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                            {feedback.scores && Object.entries(feedback.scores).map(([k, v]) => (
                                                <span key={k} style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                                    {k}: <strong style={{ color: v >= 20 ? 'var(--success)' : v >= 13 ? 'var(--warning)' : 'var(--danger)' }}>{v}/25</strong>
                                                </span>
                                            ))}
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.65', marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                            {feedback.feedback}
                                        </p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => { setResponse(''); setFeedback(null); }} className="btn-secondary" style={{ flex: 1 }}>Try Again</button>
                                            <button onClick={() => { setSIdx(i => (i + 1) % RESPONSE_SCENARIOS.length); setResponse(''); setFeedback(null); }} className="btn-primary" style={{ flex: 1 }}>
                                                Next <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {tab === 'phrases' && (
                        <motion.div key="ph" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="glass-card" style={{ padding: '40px', minHeight: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px', display: 'block' }}>
                                    {phrase.category}
                                </span>
                                <h2 style={{ fontSize: '1.6rem', lineHeight: '1.45', marginBottom: '32px', maxWidth: '520px', color: '#fff' }}>
                                    {phrase.prompt}
                                </h2>
                                <AnimatePresence mode="wait">
                                    {showAnswer ? (
                                        <motion.div key="ans" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                            style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', padding: '20px 28px', borderRadius: '14px', marginBottom: '28px', maxWidth: '500px' }}>
                                            <p style={{ fontSize: '1.1rem', color: '#fff', fontStyle: 'italic', lineHeight: '1.55' }}>"{phrase.answer}"</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="blank" style={{ height: '80px', marginBottom: '28px' }} />
                                    )}
                                </AnimatePresence>
                                {!showAnswer ? (
                                    <button onClick={() => setShowAnswer(true)} className="btn-primary" style={{ padding: '12px 28px' }}>
                                        <Eye size={18} /> Reveal Answer
                                    </button>
                                ) : (
                                    <button onClick={() => { setShowAnswer(false); setPIdx(i => (i + 1) % PHRASES.length); }} className="btn-primary"
                                        style={{ padding: '12px 28px', background: 'linear-gradient(135deg, var(--accent-secondary), #4F46E5)' }}>
                                        <Play size={18} /> Next Phrase
                                    </button>
                                )}
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '20px' }}>{pIdx + 1} / {PHRASES.length}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
