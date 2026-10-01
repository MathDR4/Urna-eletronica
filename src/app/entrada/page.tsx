"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

const box: React.CSSProperties = { maxWidth: 560, margin: '0 auto', padding: 32, borderRadius: 20, background: '#fff', boxShadow: '0 20px 60px #0002' };

export default function EntradaPage() {
  const [urna, setUrna] = useState<string | null>(null);
  const [iniciadaEm, setIniciadaEm] = useState<string | null>(null);

  useEffect(() => {
    setUrna(localStorage.getItem('urna-configurada'));
    setIniciadaEm(new Date().toISOString());
    localStorage.removeItem('urna-sessao');
  }, []);

  useEffect(() => {
    const cliente = supabase;
    const estacaoId = localStorage.getItem('estacao-id');
    if (!cliente || !urna || !estacaoId || !iniciadaEm) return;
    const verificar = async () => {
      const { data } = await cliente.from('sessoes_votacao').select('*').eq('urna_numero', Number(urna)).eq('estacao_id', estacaoId).eq('status', 'liberada').gt('liberada_em', iniciadaEm).order('liberada_em', { ascending: false }).limit(1).maybeSingle();
      if (data) { localStorage.setItem('urna-sessao', JSON.stringify(data)); window.location.href = '/'; }
    };
    verificar();
    const timer = window.setInterval(verificar, 2500);
    return () => window.clearInterval(timer);
  }, [urna, iniciadaEm]);

  return <main style={{ minHeight: '100vh', padding: 24, background: '#eef2ff', fontFamily: 'Arial, sans-serif', color: '#172554' }}><div style={box}><h1>Urna aguardando</h1><p>Informe seu discipulado diretamente ao mesário. Ele fará a liberação pelo painel.</p>{urna ? <p style={{ padding: 14, borderRadius: 10, background: '#dbeafe', fontWeight: 700 }}>Esta é a Urna {urna}</p> : <p style={{ color: '#b91c1c', fontWeight: 700 }}>Este computador ainda não foi configurado.</p>}<div style={{ marginTop: 26, padding: 18, borderRadius: 12, background: '#fef3c7', fontWeight: 700 }}>Aguardando o mesário liberar a Urna {urna || '...'}</div><a href="/configurar-urna" style={{ display: 'block', marginTop: 24, color: '#2563eb' }}>Configurar este computador</a></div></main>;
}
