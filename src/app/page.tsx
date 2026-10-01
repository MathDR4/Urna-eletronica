"use client";

import Link from 'next/link';
import { cidades, linkCidade } from './lib/cidades';

export default function HomePage() {
  return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'radial-gradient(circle at 50% 0%, #263c78, #080d1d 70%)', color: '#fff', fontFamily: 'Arial, sans-serif' }}><section style={{ width: 'min(760px, 100%)', background: '#121b35ee', border: '1px solid #34446f', borderRadius: 28, padding: 'clamp(26px, 5vw, 52px)', boxShadow: '0 24px 80px #0006' }}><div style={{ color: '#86efac', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>Central de votação</div><h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', margin: '12px 0' }}>Escolha a cidade</h1><p style={{ color: '#b8c5e8', lineHeight: 1.6 }}>Cada cidade possui suas próprias urnas, liberações, votos e apuração.</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 30 }}>{Object.values(cidades).map(cidade => <Link key={cidade.slug} href={linkCidade(`/cidade/${cidade.slug}`, cidade.slug)} style={{ textDecoration: 'none', color: '#fff', padding: 24, borderRadius: 18, background: '#1e3a6d', border: '1px solid #5274b7' }}><strong style={{ display: 'block', fontSize: 24 }}>{cidade.nome}</strong><span style={{ display: 'block', marginTop: 8, color: '#bfdbfe' }}>Abrir painel da cidade →</span></Link>)}</div></section></main>;
}
