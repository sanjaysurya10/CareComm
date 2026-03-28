'use client';
import Link from 'next/link';
import { Stethoscope, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Onboarding() {
    return (
        <main className="main-content container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Select Your Track</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Choose your role to begin your communication readiness assessment.
                </p>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Link href="/baseline" style={{ display: 'block' }}>
                        <div style={{
                            background: 'rgba(45, 212, 191, 0.1)',
                            border: '1px solid var(--accent-primary)',
                            borderRadius: '16px',
                            padding: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: 'var(--accent-primary)', color: '#000', padding: '12px', borderRadius: '12px' }}>
                                    <Stethoscope size={24} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Healthcare Assistant</h3>
                                    <p style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', marginTop: '4px' }}>8 Scenarios • ~5 mins</p>
                                </div>
                            </div>
                            <ArrowRight color="var(--accent-primary)" size={24} />
                        </div>
                    </Link>
                </motion.div>

                <div style={{ marginTop: '24px', textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>What to expect:</h4>
                    <ul style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li>You will read a short situation typical for HCAs.</li>
                        <li>Type exactly what you would say to the patient.</li>
                        <li>Our AI will score you on safety, clarity, and tone.</li>
                        <li>Receive your Baseline Readiness Score at the end.</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
