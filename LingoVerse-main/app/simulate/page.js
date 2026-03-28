'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { COMPREHENSION_SCENARIOS, RESPONSE_SCENARIOS } from '@/lib/scenarios';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Play, Pause, Send, MessageSquare, Loader2, ChevronRight, Volume2, RefreshCw } from 'lucide-react';

// Phase 1: Comprehension, Phase 2: Response, Phase 3: Done
const ALL_SCENARIOS = [
    ...COMPREHENSION_SCENARIOS,
    ...RESPONSE_SCENARIOS,
];

export default function Simulate() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [response, setResponse] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [allResults, setAllResults] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);
    const audioRef = useRef(null);
    const audioBlobUrl = useRef(null);

    // Map accentNote keywords to voice character
    const getAccentVoice = (note = '') => {
        if (note.toLowerCase().includes('cork')) return 'shimmer';
        if (note.toLowerCase().includes('galway')) return 'onyx';
        return 'fable'; // default — warmest, most European quality
    };

    // Cleanup blob URL on unmount or scenario change
    useEffect(() => {
        return () => {
            if (audioBlobUrl.current) URL.revokeObjectURL(audioBlobUrl.current);
            if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        };
    }, [currentIndex]);

    const current = ALL_SCENARIOS[currentIndex];
    const total = ALL_SCENARIOS.length;
    const isComprehension = current?.type === 'comprehension';
    const currentPhase = currentIndex < COMPREHENSION_SCENARIOS.length ? 1 : 2;
    const phaseLabel = currentPhase === 1 ? 'Comprehension Engine' : 'Response Engine';
    const phaseColor = currentPhase === 1 ? '#818CF8' : 'var(--accent-primary)';

    const playAudio = async () => {
        // If we already have a blob URL cached for this scenario, reuse it
        if (audioBlobUrl.current) {
            const audio = new Audio(audioBlobUrl.current);
            audioRef.current = audio;
            audio.onplay = () => { setIsPlaying(true); setHasPlayed(true); };
            audio.onended = () => setIsPlaying(false);
            audio.onerror = () => setIsPlaying(false);
            audio.play();
            return;
        }

        setIsLoadingAudio(true);
        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: current.audioText,
                    accent: getAccentVoice(current.accentNote),
                }),
            });
            if (!res.ok) throw new Error('TTS API failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            audioBlobUrl.current = url;

            const audio = new Audio(url);
            audioRef.current = audio;
            audio.onplay = () => { setIsPlaying(true); setHasPlayed(true); };
            audio.onended = () => setIsPlaying(false);
            audio.onerror = () => setIsPlaying(false);
            audio.play();
        } catch (err) {
            console.error('TTS playback error:', err);
        } finally {
            setIsLoadingAudio(false);
        }
    };

    const stopAudio = () => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        setIsPlaying(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!response.trim()) return;
        setIsSubmitting(true);

        try {
            if (isComprehension) {
                // Evaluate comprehension locally by keyword matching + AI
                const res = await fetch('/api/evaluate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        scenario: {
                            ...current,
                            patientSays: current.audioText,
                            category: 'Comprehension',
                            setting: 'Audio Clip',
                            keyPoints: current.keyWords,
                        },
                        userResponse: response,
                        mode: 'comprehension',
                    })
                });
                const data = await res.json();
                setFeedback(data);
                setAllResults(prev => [...prev, { type: 'comprehension', ...data }]);
            } else {
                const res = await fetch('/api/evaluate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ scenario: current, userResponse: response, mode: 'response' })
                });
                const data = await res.json();
                setFeedback(data);
                setAllResults(prev => [...prev, { type: 'response', ...data }]);
            }
        } catch (err) {
            const fallback = { scores: { relevance: 14, clarity: 14, safety: 14, tone: 14 }, feedback: 'Unable to reach AI engine. Check connection.', totalScore: 56 };
            setFeedback(fallback);
            setAllResults(prev => [...prev, { type: current.type, ...fallback }]);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < total - 1) {
            setCurrentIndex(i => i + 1);
            setResponse('');
            setFeedback(null);
            setHasPlayed(false);
        } else {
            localStorage.setItem('carecomm_baseline_results', JSON.stringify(allResults));
            router.push('/results');
        }
    };

    const progress = ((currentIndex + 1) / total) * 100;

    return (
        <main className="main-content container">
            <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%' }}>

                {/* Progress bar */}
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: phaseColor, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {currentPhase === 1 ? <Headphones size={14} /> : <MessageSquare size={14} />} {phaseLabel}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentIndex + 1}/{total}</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div animate={{ width: progress + '%' }} style={{ height: '100%', background: phaseColor, borderRadius: '3px' }} />
                    </div>
                    {/* Phase markers */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: currentPhase === 1 ? '#818CF8' : 'var(--text-muted)' }}>Phase 1: Listen & Transcribe</span>
                        <span style={{ fontSize: '0.75rem', color: currentPhase === 2 ? 'var(--accent-primary)' : 'var(--text-muted)' }}>Phase 2: Response Scenarios</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="glass-card"
                        style={{ padding: '36px' }}
                    >
                        {/* Comprehension card */}
                        {isComprehension && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ background: 'rgba(129,140,248,0.12)', padding: '10px', borderRadius: '12px', color: '#818CF8' }}>
                                        <Headphones size={22} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>Comprehension Test</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{current.accentNote}</p>
                                    </div>
                                </div>

                                {/* Audio player */}
                                <div className="glass" style={{ padding: '20px 24px', borderRadius: '14px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(129,140,248,0.06)', borderColor: 'rgba(129,140,248,0.15)' }}>
                                    <button
                                        onClick={isPlaying ? stopAudio : playAudio}
                                        disabled={isLoadingAudio}
                                        style={{ background: '#818CF8', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0, opacity: isLoadingAudio ? 0.7 : 1 }}
                                    >
                                        {isLoadingAudio ? <Loader2 size={18} color="#fff" className="animate-spin" /> : isPlaying ? <Pause size={20} color="#fff" /> : <Play size={20} color="#fff" />}
                                    </button>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                            <Volume2 size={14} color="#818CF8" />
                                            <span style={{ fontSize: '0.85rem', color: '#818CF8', fontWeight: '500' }}>Patient Audio</span>
                                        </div>
                                        {/* Fake waveform */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '24px' }}>
                                            {Array.from({ length: 32 }).map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={isPlaying ? { height: [4, Math.random() * 20 + 4, 4] } : { height: 4 }}
                                                    transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                                                    style={{ width: '3px', background: 'rgba(129,140,248,0.6)', borderRadius: '2px', minHeight: '4px' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                                        {isLoadingAudio && <span style={{ fontSize: '0.75rem', color: '#818CF8' }}>Generating audio...</span>}
                                        {!hasPlayed && !isLoadingAudio && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Press play to begin</span>}
                                        {hasPlayed && !isPlaying && !isLoadingAudio && (
                                            <button onClick={playAudio} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <RefreshCw size={12} /> Replay
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: '500' }}>
                                    🎯 Task: {current.task}
                                </p>
                            </>
                        )}

                        {/* Response card */}
                        {!isComprehension && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ background: 'rgba(45,212,191,0.12)', padding: '10px', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                                        <MessageSquare size={22} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{current.category}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Setting: {current.setting} · Difficulty: <span style={{ color: current.difficulty === 'Hard' || current.difficulty === 'Very Hard' ? 'var(--danger)' : 'var(--warning)' }}>{current.difficulty}</span></p>
                                    </div>
                                </div>

                                {current.background && (
                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid var(--accent-secondary)', padding: '16px 20px', borderRadius: '4px 12px 12px 4px', marginBottom: '24px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                        <strong style={{ color: '#fff' }}>Context: </strong> {current.background}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '14px', marginBottom: '28px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: '18px' }}>👤</span>
                                    </div>
                                    <div style={{ background: 'var(--bg-secondary)', padding: '14px 18px', borderRadius: '4px 16px 16px 16px', fontSize: '1.15rem', lineHeight: '1.55', color: '#fff', flex: 1 }}>
                                        "{current.patientSays}"
                                    </div>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                    💬 What would you say? Type your exact response.
                                </p>
                            </>
                        )}

                        {/* Text input */}
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                placeholder={isComprehension ? 'Type what you heard / your summary here...' : 'Type exactly what you would say to the patient...'}
                                disabled={isSubmitting || !!feedback}
                                rows={4}
                                style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '1rem', resize: 'none', outline: 'none', fontFamily: 'inherit', marginBottom: '16px', transition: 'border-color 0.2s' }}
                                onFocus={e => e.target.style.borderColor = phaseColor}
                                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                            />
                            {!feedback && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        type="submit"
                                        disabled={!response.trim() || isSubmitting}
                                        className="btn-primary"
                                        style={{ opacity: !response.trim() ? 0.5 : 1, background: currentPhase === 1 ? 'linear-gradient(135deg, #818CF8, #6366F1)' : 'linear-gradient(135deg, var(--accent-primary), #10B981)' }}
                                    >
                                        {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Evaluating...</> : <><Send size={18} /> Submit</>}
                                    </button>
                                </div>
                            )}
                        </form>

                        {/* Feedback panel */}
                        {feedback && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '24px' }}>
                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                                    {/* Score pills */}
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                        {feedback.scores && Object.entries(feedback.scores).map(([k, v]) => (
                                            <div key={k} style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem' }}>
                                                <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k}: </span>
                                                <span style={{ color: v >= 20 ? 'var(--success)' : v >= 13 ? 'var(--warning)' : 'var(--danger)', fontWeight: '600' }}>{v}/25</span>
                                            </div>
                                        ))}
                                        <div style={{ background: phaseColor + '22', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', color: phaseColor }}>
                                            Total: {feedback.totalScore}/100
                                        </div>
                                    </div>

                                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                            {feedback.feedback}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        className="btn-primary"
                                        style={{ width: '100%', justifyContent: 'center', background: currentIndex < total - 1 ? 'linear-gradient(135deg, var(--accent-secondary), #4F46E5)' : 'linear-gradient(135deg, var(--success), #059669)' }}
                                    >
                                        {currentIndex < total - 1 ? <>Next <ChevronRight size={18} /></> : <>View Readiness Score 🏁</>}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
}
