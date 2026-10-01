"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cidades, cidadeValida } from '@/app/lib/cidades';

export default function CidadePage() {
  const params = useParams() as { cidade?: string };
  const slug = cidadeValida(params?.cidade);
  const cidade = cidades[slug];
  const links = [
    [`/${slug}/urna`, slug === 'goiania' ? 'Urna direta' : 'Urna / entrada'],
    [`/${slug}/mesario`, 'Painel do mesário'],
    [`/${slug}/configurar-urna`, 'Configurar computador'],
    [`/${slug}/apuracao`, 'Relatório de apuração'],
    [`/${slug}/grafico`, 'Apuração ao vivo'],
  ];
  return <main style={{ minHeight: '100vh', padding: 'clamp(24px, 5vw, 64px)', background: 'radial-gradient(circle at 80% 0%, #243866, #080d1d 65%)', color: '#fff', fontFamily: 'Arial, sans-serif' }}><section style={{ width: 'min(1000px, 100%)', margin: '0 auto' }}><Link href="/" style={{ color: '#bfdbfe' }}>← Área do administrador</Link><div style={{ margin: '30px 0' }}><div style={{ color: '#86efac', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>Links exclusivos</div><h1 style={{ fontSize: 'clamp(36px, 7vw, 64px)', margin: '10px 0' }}>{cidade.nome}</h1><p style={{ color: '#b8c5e8' }}>Estes são os endereços desta cidade. Compartilhe somente os links necessários com a equipe.</p></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>{links.map(([href, label]) => <Link key={href} href={href} style={{ color: '#fff', textDecoration: 'none', background: '#121b35e8', border: '1px solid #34446f', borderRadius: 18, padding: 24, fontSize: 20, fontWeight: 700 }}>{label}<span style={{ display: 'block', color: '#93c5fd', fontSize: 14, marginTop: 12 }}>Abrir →</span></Link>)}</div></section></main>;
}
