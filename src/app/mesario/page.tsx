"use client";

import { useEffect, useState } from 'react';
import { discipulados } from '@/app/lib/discipulados';
import { supabase } from '@/app/lib/supabase';

export default function MesarioPage() {
  const [fila, setFila] = useState<any[]>([]);
  const [urna, setUrna] = useState('1');
  const [mensagem, setMensagem] = useState('');
  const carregar = async () => { if (!supabase) return; const { data } = await supabase.from('sessoes_votacao').select('*').eq('status', 'aguardando').order('criada_em'); setFila(data || []); };
  useEffect(() => { carregar(); const timer = window.setInterval(carregar, 3000); return () => window.clearInterval(timer); }, []);
  const liberar = async (id: string) => { if (!supabase) return; const { error } = await supabase.from('sessoes_votacao').update({ status: 'liberada', liberada_em: new Date().toISOString() }).eq('id', id).eq('status', 'aguardando'); setMensagem(error ? error.message : 'Urna liberada. O eleitor já pode votar.'); carregar(); };
  const liberarProxima = () => { const item = fila.find(s => s.urna_numero === Number(urna)); if (!item) setMensagem(`Não há eleitor aguardando na urna ${urna}.`); else liberar(item.id); };
  return <main style={{ minHeight: '100vh', padding: 32, background: '#0f172a', color: '#fff', fontFamily: 'Arial, sans-serif' }}><div style={{ maxWidth: 900, margin: '0 auto' }}><h1>Painel do mesário</h1><p>Selecione a urna e libere somente o eleitor correspondente.</p><div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '28px 0' }}><select value={urna} onChange={e => setUrna(e.target.value)} style={{ padding: 14, borderRadius: 8 }}>{[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}</select><button onClick={liberarProxima} style={{ padding: 14, border: 0, borderRadius: 8, background: '#22c55e', color: '#052e16', fontWeight: 800 }}>LIBERAR PRÓXIMO DA URNA {urna}</button></div>{mensagem && <p style={{ color: '#86efac' }}>{mensagem}</p>}<h2>Fila de solicitações</h2><div style={{ display: 'grid', gap: 12 }}>{fila.map(item => <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 12, background: '#1e293b' }}><span><strong>Urna {item.urna_numero}</strong> · {item.discipulado}<br/><small>{new Date(item.criada_em).toLocaleTimeString('pt-BR')}</small></span><button onClick={() => liberar(item.id)} style={{ padding: 10, borderRadius: 8, border: 0, background: '#facc15', fontWeight: 700 }}>LIBERAR</button></div>)}{fila.length === 0 && <p>Nenhuma solicitação aguardando.</p>}</div></div></main>;
}
