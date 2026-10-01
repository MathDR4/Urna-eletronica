"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { cidadeAtual } from '@/app/lib/cidades';

export default function ConfigurarUrnaPage() {
  const [urna, setUrna] = useState('1');
  const [mensagem, setMensagem] = useState('');
  useEffect(() => {
    if (cidadeAtual() === 'goiania') window.location.href = '/goiania/urna';
  }, []);
  const salvar = async () => {
    if (!supabase) { setMensagem('Supabase não configurado.'); return; }
    const cidade = cidadeAtual();
    const codigo = localStorage.getItem('estacao-codigo') || `ESTACAO-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const idSalvo = localStorage.getItem('estacao-id');
    const consulta = idSalvo
      ? await supabase.from('estacoes_urna').update({ codigo, urna_numero: Number(urna), cidade_slug: cidade, ultimo_acesso: new Date().toISOString() }).eq('id', idSalvo).eq('cidade_slug', cidade).select('id').single()
      : await supabase.from('estacoes_urna').insert({ codigo, urna_numero: Number(urna), cidade_slug: cidade }).select('id').single();
    if (consulta.error || !consulta.data) { setMensagem(consulta.error?.message || 'Não foi possível cadastrar. Talvez essa urna já esteja em uso.'); return; }
    localStorage.setItem('estacao-codigo', codigo); localStorage.setItem('estacao-id', consulta.data.id); localStorage.setItem('urna-configurada', urna); localStorage.removeItem('urna-sessao'); window.location.href = `/entrada?cidade=${cidade}`;
  };
  return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'radial-gradient(circle at 20% 0%, #263c78, #080d1d 68%)', fontFamily: 'Arial, sans-serif', padding: 24, color: '#fff' }}><div style={{ maxWidth: 560, width: '100%' }}><div style={{ marginBottom: 22, color: '#a5b4fc', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>Central de votação · configuração</div><div style={{ background: '#121b35e8', border: '1px solid #34446f', padding: 38, borderRadius: 28, boxShadow: '0 24px 80px #0006' }}><div style={{ width: 58, height: 58, borderRadius: 18, display: 'grid', placeItems: 'center', background: '#2563eb', fontSize: 28, marginBottom: 22 }}>⚙</div><h1 style={{ fontSize: 36, margin: '0 0 12px' }}>Configurar estação</h1><p style={{ color: '#b8c5e8', lineHeight: 1.6, marginBottom: 30 }}>Vincule este computador a uma urna. Essa configuração será usada para identificar a estação durante a votação.</p><label style={{ display: 'block', color: '#dbeafe', fontWeight: 700 }}>Número da urna<select value={urna} onChange={e => setUrna(e.target.value)} style={{ display: 'block', width: '100%', padding: 16, margin: '10px 0 24px', borderRadius: 12, border: '1px solid #52658f', background: '#0b1228', color: '#fff', fontSize: 16 }}>{[1,2,3,4,5].map(n => <option key={n} value={n}>Urna {n}</option>)}</select></label><button onClick={salvar} style={{ width: '100%', padding: 17, border: 0, borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: .5 }}>CADASTRAR ESTAÇÃO</button>{mensagem && <p style={{ color: '#fca5a5', marginTop: 18 }}>{mensagem}</p>}</div></div></main>;
}
