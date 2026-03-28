'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Headphones, MessageSquare, BarChart2 } from 'lucide-react';

// This page is now a redirect/entry to the full simulation flow
// The /simulate page handles both comprehension + response engines
export default function BaselinePage() {
    return (
        <main className="main-content container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Readiness Assessment</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
                    Your full simulation runs two phases: accent comprehension and patient response scenarios.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginBottom: '32px' }}>
                    {[
                        { icon: <Headphones size={18} color="#818CF8" />, title: 'Phase 1 — Comprehension', desc: 'Listen to Irish patient audio and transcribe or summarise.' },
                        { icon: <MessageSquare size={18} color="var(--accent-primary)" />, title: 'Phase 2 — Response', desc: 'Read real care scenarios and type what you would say.' },
                        { icon: <BarChart2 size={18} color="var(--warning)" />, title: 'Readiness Score', desc: 'Get your 4-dimension Communication Readiness Score.' },
                    ].map(item => (
                        <div key={item.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <div style={{ marginTop: '2px' }}>{item.icon}</div>
                            <div>
                                <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>{item.title}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Link href="/simulate" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px' }}>
                    Start Full Assessment <ArrowRight size={18} />
                </Link>
            </div>
        </main>
    );
}
