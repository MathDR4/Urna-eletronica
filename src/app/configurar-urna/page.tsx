"use client";
import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';

export default function ConfigurarUrnaPage() {
  const [urna, setUrna] = useState('1');
  const [mensagem, setMensagem] = useState('');
  const salvar = async () => {
    if (!supabase) { setMensagem('Supabase não configurado.'); return; }
    const codigo = localStorage.getItem('estacao-codigo') || `ESTACAO-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const idSalvo = localStorage.getItem('estacao-id');
    const consulta = idSalvo
      ? await supabase.from('estacoes_urna').update({ codigo, urna_numero: Number(urna), ultimo_acesso: new Date().toISOString() }).eq('id', idSalvo).select('id').single()
      : await supabase.from('estacoes_urna').insert({ codigo, urna_numero: Number(urna) }).select('id').single();
    if (consulta.error || !consulta.data) { setMensagem(consulta.error?.message || 'Não foi possível cadastrar. Talvez essa urna já esteja em uso.'); return; }
    localStorage.setItem('estacao-codigo', codigo); localStorage.setItem('estacao-id', consulta.data.id); localStorage.setItem('urna-configurada', urna); window.location.href = '/entrada';
  };
  return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0f172a', fontFamily: 'Arial, sans-serif', padding: 24 }}><div style={{ maxWidth: 480, width: '100%', background: '#fff', padding: 32, borderRadius: 20, color: '#172554' }}><h1>Configurar estação</h1><p>O sistema vai gerar um código único para este notebook e vinculá-lo a uma urna.</p><label>Este computador será a<select value={urna} onChange={e => setUrna(e.target.value)} style={{ display: 'block', width: '100%', padding: 14, margin: '10px 0 24px' }}>{[1,2,3,4,5].map(n => <option key={n} value={n}>Urna {n}</option>)}</select></label><button onClick={salvar} style={{ width: '100%', padding: 15, border: 0, borderRadius: 10, background: '#2563eb', color: '#fff', fontWeight: 700 }}>CADASTRAR ESTAÇÃO</button>{mensagem && <p style={{ color: '#b91c1c', marginTop: 16 }}>{mensagem}</p>}</div></main>;
}
