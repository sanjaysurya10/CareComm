'use client';
import { useEffect, useState } from 'react';
import { calculateReadinessScore } from '@/lib/scoring';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, Shield, Headphones, MessageSquare, BarChart2, RefreshCw } from 'lucide-react';

export default function Results() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem('carecomm_baseline_results');
        if (raw) {
            setData(calculateReadinessScore(JSON.parse(raw)));
        } else {
            setData(calculateReadinessScore([]));
        }
    }, []);

    if (!data) return (
        <main className="main-content container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading results...</div>
        </main>
    );

    const getLabelConfig = () => {
        const l = data.label;
        if (l.includes('Job-Ready')) return { color: 'var(--success)', rgb: '52,211,153', icon: <CheckCircle size={28} /> };
        if (l.includes('Supervised')) return { color: 'var(--warning)', rgb: '251,191,36', icon: <AlertTriangle size={28} /> };
        if (l.includes('Monitored')) return { color: '#FB923C', rgb: '251,146,60', icon: <AlertTriangle size={28} /> };
        return { color: 'var(--danger)', rgb: '239,68,68', icon: <XCircle size={28} /> };
    };

    const cfg = getLabelConfig();

    const categoryIcons = {
        'Accent Comprehension': <Headphones size={16} />,
        'Patient Interaction': <MessageSquare size={16} />,
        'Safety Communication': <Shield size={16} />,
        'Reporting Clarity': <BarChart2 size={16} />,
    };

    const ScoreBar = ({ label, score }) => (
        <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    {categoryIcons[label]} {label}
                </span>
                <span style={{ fontWeight: '700', fontSize: '1rem', color: score >= 80 ? 'var(--success)' : score >= 65 ? 'var(--warning)' : 'var(--danger)' }}>
                    {score}%
                </span>
            </div>
            <div style={{ width: '100%', height: '7px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: score + '%' }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{ height: '100%', background: score >= 80 ? 'var(--success)' : score >= 65 ? 'var(--warning)' : 'var(--danger)', borderRadius: '4px' }}
                />
            </div>
        </div>
    );

    return (
        <main className="main-content container animate-fade-in" style={{ padding: '40px 24px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto' }}>

                {/* Score hero */}
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(' + cfg.rgb + ',0.12)', color: cfg.color, marginBottom: '20px', border: '1px solid rgba(' + cfg.rgb + ',0.3)' }}>
                        {cfg.icon}
                    </div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.03em' }}>{data.overall}<span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>%</span></h1>
                        <h2 style={{ fontSize: '1.3rem', color: cfg.color, marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Shield size={18} /> {data.label}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto' }}>
                            Communication Readiness Score — assessed across accent comprehension, patient interaction, safety, and reporting clarity.
                        </p>
                    </motion.div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {/* Breakdown */}
                    <div className="glass-card" style={{ padding: '28px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '24px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BarChart2 size={16} /> Dimension Breakdown
                        </h3>
                        {Object.entries(data.categoryScores).map(([key, val]) => (
                            <ScoreBar key={key} label={key} score={val} />
                        ))}
                    </div>

                    {/* Next steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', color: 'var(--accent-secondary)' }}>What this means</h3>
                            {data.labelShort === 'Job-Ready' && (
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                    Strong performance across all dimensions. You demonstrate the communication ability expected for Day 1 in a care setting.
                                </p>
                            )}
                            {data.labelShort === 'Supervised Ready' && (
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                    Good foundation — you can communicate safely with light supervision. Focused training in your weaker dimensions will close the gap.
                                </p>
                            )}
                            {(data.labelShort === 'Monitored' || data.labelShort === 'Not Ready') && (
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                    More practice is needed before independent patient interaction. Use the Training Ground to build core communication skills.
                                </p>
                            )}
                        </div>

                        <Link href="/training" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', fontSize: '1rem' }}>
                            Go to Training Ground <ArrowRight size={18} />
                        </Link>
                        <Link href="/simulate" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', fontSize: '0.9rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                            <RefreshCw size={16} /> Re-run Simulation
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
