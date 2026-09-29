"use client";

import { useEffect, useState } from 'react';
import { discipulados } from '@/app/lib/discipulados';
import { supabase } from '@/app/lib/supabase';

const box: React.CSSProperties = { maxWidth: 560, margin: '0 auto', padding: 32, borderRadius: 20, background: '#fff', boxShadow: '0 20px 60px #0002' };

export default function EntradaPage() {
  const [urna, setUrna] = useState<string | null>(null);
  const [discipulado, setDiscipulado] = useState('');
  const [status, setStatus] = useState('');
  const [sessao, setSessao] = useState<string | null>(null);

  useEffect(() => {
    setUrna(localStorage.getItem('urna-configurada'));
  }, []);

  useEffect(() => {
    const cliente = supabase;
    if (!cliente || !sessao) return;
    const canal = cliente.channel(`sessao-${sessao}`).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessoes_votacao', filter: `id=eq.${sessao}` }, payload => {
      if (payload.new.status === 'liberada') {
        localStorage.setItem('urna-sessao', JSON.stringify(payload.new));
        window.location.href = '/';
      }
    }).subscribe();
    return () => { cliente.removeChannel(canal); };
  }, [sessao]);

  const solicitar = async () => {
    if (!supabase) { setStatus('Supabase não configurado neste dispositivo.'); return; }
    if (!discipulado) { setStatus('Selecione seu discipulado.'); return; }
    if (!urna) { setStatus('Este computador ainda não foi configurado como uma urna.'); return; }
    const estacaoId = localStorage.getItem('estacao-id');
    const { data, error } = await supabase.from('sessoes_votacao').insert({ urna_numero: Number(urna), discipulado }).select('id').single();
    if (estacaoId) await supabase.from('estacoes_urna').update({ ultimo_acesso: new Date().toISOString(), ativa: true }).eq('id', estacaoId);
    if (error || !data) { setStatus(error?.message || 'Não foi possível solicitar.'); return; }
    setSessao(data.id);
    setStatus(`Aguardando o mesário liberar a urna ${urna}...`);
  };

  return <main style={{ minHeight: '100vh', padding: 24, background: '#eef2ff', fontFamily: 'Arial, sans-serif', color: '#172554' }}><div style={box}><h1>Identificação do eleitor</h1><p>Informe seu discipulado e aguarde o mesário liberar esta urna.</p>{urna ? <p style={{ padding: 14, borderRadius: 10, background: '#dbeafe', fontWeight: 700 }}>Você está na Urna {urna}</p> : <p style={{ color: '#b91c1c', fontWeight: 700 }}>Este computador ainda não foi configurado.</p>}<label>Seu discipulado<select value={discipulado} onChange={e => setDiscipulado(e.target.value)} style={{ display: 'block', width: '100%', padding: 14, margin: '8px 0 20px' }}><option value="">Selecione...</option>{discipulados.map(item => <option key={item}>{item}</option>)}</select></label><button onClick={solicitar} disabled={!!sessao || !urna} style={{ width: '100%', padding: 16, border: 0, borderRadius: 10, background: '#2563eb', color: '#fff', fontWeight: 700 }}>{sessao ? 'AGUARDANDO LIBERAÇÃO' : 'ENTRAR NA FILA'}</button>{status && <p style={{ marginTop: 20, fontWeight: 700 }}>{status}</p>}<a href="/configurar-urna" style={{ display: 'block', marginTop: 24, color: '#2563eb' }}>Configurar este computador</a></div></main>;
}
