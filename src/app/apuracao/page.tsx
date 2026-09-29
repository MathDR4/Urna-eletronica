"use client";

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

type Voto = {
  id: number;
  numero: number | null;
  nome: string;
  chapa: string;
  cor: string;
  tipo: 'válido' | 'branco' | 'nulo';
  data_hora: string;
};

export default function ApuracaoPage() {
  const [votos, setVotos] = useState<Voto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarVotos = async () => {
    if (!supabase) {
      setErro('Supabase não configurado.');
      setCarregando(false);
      return;
    }
    const { data, error } = await supabase.from('votos').select('*').order('data_hora', { ascending: true });
    if (error) setErro(error.message);
    else setVotos(data || []);
    setCarregando(false);
  };

  useEffect(() => { carregarVotos(); }, []);

  const validos = votos.filter(voto => voto.tipo === 'válido');
  const brancos = votos.filter(voto => voto.tipo === 'branco').length;
  const nulos = votos.filter(voto => voto.tipo === 'nulo').length;
  const apuracao = useMemo(() => {
    const grupos = new Map<string, { nome: string; chapa: string; cor: string; numero: number | null; total: number }>();
    validos.forEach(voto => {
      const chave = String(voto.numero);
      const atual = grupos.get(chave) || { nome: voto.nome, chapa: voto.chapa, cor: voto.cor, numero: voto.numero, total: 0 };
      atual.total += 1;
      grupos.set(chave, atual);
    });
    return Array.from(grupos.values()).sort((a, b) => b.total - a.total);
  }, [votos]);

  const exportarCsv = () => {
    const linhas = [['Data e hora', 'Número', 'Nome', 'Chapa', 'Cor', 'Tipo'], ...votos.map(voto => [
      new Date(voto.data_hora).toLocaleString('pt-BR'), String(voto.numero || ''), voto.nome, voto.chapa, voto.cor, voto.tipo
    ])];
    const csv = linhas.map(linha => linha.map(celula => `"${celula.replaceAll('"', '""')}"`).join(';')).join('\n');
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'extrato-votacao.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main style={{ maxWidth: 1000, margin: '32px auto', padding: 24, fontFamily: 'Arial, sans-serif', color: '#17202a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div><h1 style={{ marginBottom: 6 }}>Apuração dos votos</h1><p style={{ marginTop: 0 }}>Dinâmica da igreja · urna-igreja</p></div>
        <button onClick={carregarVotos} style={{ padding: '10px 16px', cursor: 'pointer' }}>Atualizar</button>
      </div>
      {erro && <p style={{ color: '#b42318' }}>{erro}</p>}
      {carregando ? <p>Carregando votos...</p> : <>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, margin: '24px 0' }}>
          {[['Total', votos.length], ['Válidos', validos.length], ['Brancos', brancos], ['Nulos', nulos]].map(([titulo, total]) => <div key={String(titulo)} style={{ padding: 18, borderRadius: 10, background: '#f1f5f9' }}><small>{titulo}</small><div style={{ fontSize: 30, fontWeight: 700 }}>{total}</div></div>)}
        </section>
        <h2>Resultado por chapa</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {apuracao.length === 0 ? <p>Nenhum voto válido registrado.</p> : apuracao.map(chapa => <div key={String(chapa.numero)} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: 16, border: '1px solid #ddd', borderRadius: 10 }}><span><strong>{chapa.numero} · {chapa.nome}</strong><br />{chapa.chapa} · {chapa.cor}</span><strong>{chapa.total} voto(s)</strong></div>)}
        </div>
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2>Extrato detalhado</h2><button onClick={exportarCsv} style={{ padding: '10px 16px', cursor: 'pointer' }}>Exportar CSV</button></div>
        <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr>{['Data e hora', 'Número', 'Nome', 'Chapa', 'Tipo'].map(titulo => <th key={titulo} style={{ textAlign: 'left', borderBottom: '2px solid #ddd', padding: 10 }}>{titulo}</th>)}</tr></thead><tbody>{votos.map(voto => <tr key={voto.id}>{[new Date(voto.data_hora).toLocaleString('pt-BR'), voto.numero || '-', voto.nome || '-', voto.chapa || '-', voto.tipo].map((valor, i) => <td key={i} style={{ borderBottom: '1px solid #eee', padding: 10 }}>{valor}</td>)}</tr>)}</tbody></table></div>
      </>}
    </main>
  );
}
