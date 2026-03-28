import Link from 'next/link';
import { Headphones, MessageSquare, BarChart2, ArrowRight, Mic, Activity, Shield } from 'lucide-react';

export default function Home() {
    return (
        <main className="main-content container">

            {/* Hero */}
            <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '60px 20px 40px' }} className="animate-fade-in">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent-primary)', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '28px', border: '1px solid rgba(45,212,191,0.2)' }}>
                    <Activity size={14} /> Simulation-Based Readiness Platform
                </div>
                <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', marginBottom: '24px', letterSpacing: '-0.02em', lineHeight: '1.15' }}>
                    We test what you <span className="accent-gradient">can do</span>.<br />Not what you know.
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 16px' }}>
                    Real Irish care scenarios. Real accents. Real pressure. <br />
                    Simulate patient conversations and get a performance score employers trust.
                </p>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
                    Not a language app. Not QQI support. A <strong style={{ color: 'var(--text-secondary)' }}>communication performance simulator.</strong>
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/simulate" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 28px' }}>
                        Start Simulation <ArrowRight size={18} />
                    </Link>
                    <Link href="/training" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 28px' }}>
                        Practice Mode
                    </Link>
                </div>
            </section>

            {/* 3 Engines */}
            <section style={{ marginTop: '80px' }}>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '40px' }}>
                    3 Integrated Engines
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

                    <div className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ background: 'rgba(129, 140, 248, 0.12)', width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#818CF8', border: '1px solid rgba(129,140,248,0.2)' }}>
                            <Headphones size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Comprehension Engine</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px', fontSize: '0.95rem' }}>
                            Listen to Irish patient speech — elderly voices, rural accents, fast pace. Transcribe or summarise what you heard.
                        </p>
                        <p style={{ fontSize: '0.85rem', color: '#818CF8', fontWeight: '500' }}>Measures: Accent comprehension & missed keywords</p>
                    </div>

                    <div className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ background: 'rgba(45, 212, 191, 0.12)', width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--accent-primary)', border: '1px solid rgba(45,212,191,0.2)' }}>
                            <MessageSquare size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Response Engine</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px', fontSize: '0.95rem' }}>
                            Read a real care scenario. Type exactly what you would say. AI evaluates your clarity, tone, safety, and phrasing.
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '500' }}>Measures: Patient interaction & safety communication</p>
                    </div>

                    <div className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ background: 'rgba(251, 191, 36, 0.12)', width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--warning)', border: '1px solid rgba(251,191,36,0.2)' }}>
                            <BarChart2 size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Readiness Scoring</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px', fontSize: '0.95rem' }}>
                            Four weighted dimensions combine into a single credible score: Supervised, Monitored, or Job-Ready.
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--warning)', fontWeight: '500' }}>Output: Comparable, trackable, shareable</p>
                    </div>
                </div>
            </section>

            {/* Pitch block */}
            <section className="glass-card" style={{ margin: '60px 0', padding: '44px', textAlign: 'center', borderColor: 'rgba(45,212,191,0.15)' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>
                    "Candidate is safe for <span className="accent-gradient">supervised care communication.</span>"
                </h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 28px', lineHeight: '1.6' }}>
                    That's the output. A clear, evidence-backed label employers can act on — not a QQI certificate that says nothing about Day 1 performance.
                </p>
                <Link href="/simulate" className="btn-primary">
                    Get Your Score <Shield size={18} />
                </Link>
            </section>
        </main>
    );
}
