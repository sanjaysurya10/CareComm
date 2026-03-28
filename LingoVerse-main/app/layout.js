import '../styles/globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'CareComm | Healthcare Communication Simulator',
    description: 'Simulation-based communication readiness for healthcare workers in Ireland.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <nav style={{
                    padding: '20px 32px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    background: 'rgba(10, 13, 20, 0.85)',
                    backdropFilter: 'blur(12px)',
                }}>
                    <Link href="/" style={{ fontWeight: '700', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: '900' }}>+</span>
                        CareComm
                    </Link>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Link href="/simulate" style={{ color: 'var(--text-secondary)', padding: '8px 16px', fontSize: '14px', borderRadius: '8px', transition: 'all 0.2s' }}>Simulate</Link>
                        <Link href="/training" style={{ color: 'var(--text-secondary)', padding: '8px 16px', fontSize: '14px', borderRadius: '8px', transition: 'all 0.2s' }}>Practice</Link>
                        <Link href="/simulate" className="btn-primary" style={{ fontSize: '14px', padding: '8px 18px' }}>Get Scored</Link>
                    </div>
                </nav>
                {children}
            </body>
        </html>
    )
}
