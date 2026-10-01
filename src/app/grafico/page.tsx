"use client";

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

type Voto = { numero: number | null; nome: string; chapa: string; cor: string; tipo: string };
type Grupo = { numero: number; nome: string; chapa: string; cor: string; total: number };

const corDaChapa = (cor: string) => ({ Amarelo: '#eab308', Verde: '#22c55e', Azul: '#3b82f6' }[cor] || '#64748b');

export default function GraficoPage() {
  const [votos, setVotos] = useState<Voto[]>([]);
  const [atualizadoEm, setAtualizadoEm] = useState(new Date());
  const [modoSuspense, setModoSuspense] = useState(false);
  const [inicioSuspense, setInicioSuspense] = useState<number | null>(null);
  const [agora, setAgora] = useState(Date.now());
  const [delayMs, setDelayMs] = useState(480000);

  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);
    // O gráfico público sempre começa no modo de suspense. Use real=1 apenas
    // para inspeção técnica sem votos fictícios.
    const modoDemo = parametros.get('real') !== '1';
    setModoSuspense(modoDemo);
    let relogio: number | undefined;
    if (modoDemo) {
      const minutos = Math.min(10, Math.max(5, Number(parametros.get('minutos')) || 8));
      const chave = `grafico-suspense-inicio-${minutos}`;
      const salvo = window.sessionStorage.getItem(chave);
      const inicio = salvo ? Number(salvo) : Date.now();
      if (!salvo) window.sessionStorage.setItem(chave, String(inicio));
      setInicioSuspense(inicio);
      setDelayMs(minutos * 60 * 1000);
      // O painel público avança em blocos de 5 minutos para não ficar
      // alterando os números a cada segundo durante a apresentação.
      relogio = window.setInterval(() => setAgora(Date.now()), 300000);
    }
    const cliente = supabase;
    if (!cliente) return () => { if (relogio) window.clearInterval(relogio); };
    const carregar = async () => {
      const { data } = await cliente.from('votos').select('numero,nome,chapa,cor,tipo');
      setVotos(data || []);
      setAtualizadoEm(new Date());
    };
    carregar();
    const canal = cliente.channel('grafico-votos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votos' }, carregar)
      .subscribe();
    const intervalo = window.setInterval(carregar, 5000);
    return () => { cliente.removeChannel(canal); window.clearInterval(intervalo); if (relogio) window.clearInterval(relogio); };
  }, []);

  const validos = votos.filter(voto => voto.tipo === 'válido');
  const gruposReais = useMemo(() => {
    const mapa = new Map<number, { numero: number; nome: string; chapa: string; cor: string; total: number }>();
    validos.forEach(voto => {
      if (voto.numero === null) return;
      const atual = mapa.get(voto.numero) || { numero: voto.numero, nome: voto.nome, chapa: voto.chapa, cor: voto.cor, total: 0 };
      atual.total += 1;
      mapa.set(voto.numero, atual);
    });
    return Array.from(mapa.values()).sort((a, b) => b.total - a.total);
  }, [validos]);
  const grupos = useMemo(() => {
    if (!modoSuspense || !inicioSuspense) return gruposReais;
    const fake: Grupo[] = [
      { numero: 12, nome: 'Lauanny', chapa: 'Somos Um', cor: 'Amarelo', total: 12 },
      { numero: 17, nome: 'Manu', chapa: 'Filhos de Deus', cor: 'Verde', total: 11 },
      { numero: 67, nome: 'João Arthur', chapa: 'Fortes e Intensos', cor: 'Azul', total: 13 },
    ];
    const progresso = Math.min(1, Math.max(0, (agora - inicioSuspense) / delayMs));
    const transicao = Math.min(1, Math.max(0, (progresso - 0.7) / 0.3));
    const reais = new Map(gruposReais.map(grupo => [grupo.numero, grupo]));
    const totalReal = gruposReais.reduce((total, grupo) => total + grupo.total, 0);
    const ciclo = Math.floor((agora - inicioSuspense) / 300000);
    const pesosBase = [0.42, 0.33, 0.25];
    const pesos = fake.map((_, index) => pesosBase[(index + ciclo) % pesosBase.length]);
    const totalExibido = Math.min(totalReal, Math.max(totalReal >= 3 ? 3 : totalReal, Math.floor(totalReal * (0.25 + progresso * 0.75))));
    const distribuicao = fake.map((grupo, index) => ({ ...grupo, total: totalReal >= 3 ? Math.max(1, Math.floor(totalExibido * pesos[index])) : 0 }));
    let sobra = totalExibido - distribuicao.reduce((total, grupo) => total + grupo.total, 0);
    for (let index = 0; sobra > 0; index = (index + 1) % distribuicao.length) {
      distribuicao[index].total += 1;
      sobra -= 1;
    }
    return distribuicao.map(grupo => {
      const real = reais.get(grupo.numero)?.total || 0;
      return { ...grupo, total: transicao < 1 ? grupo.total : Math.max(0, Math.round(grupo.total * (1 - transicao) + real * transicao)) };
    });
  }, [agora, delayMs, gruposReais, inicioSuspense, modoSuspense]);
  const progressoSuspense = modoSuspense && inicioSuspense ? Math.min(1, Math.max(0, (agora - inicioSuspense) / delayMs)) : 1;
  const validosExibidos = modoSuspense ? grupos.reduce((total, grupo) => total + grupo.total, 0) : validos.length;
  const maior = Math.max(...grupos.map(grupo => grupo.total), 1);
  const regioes = [
    { id: 1, nome: 'Pastor e Pedro', pontos: '90,20 330,20 300,150 180,170 70,120' },
    { id: 2, nome: 'Júnio e Duarte', pontos: '330,20 560,45 520,170 300,150' },
    { id: 3, nome: 'William e Felipe', pontos: '560,45 780,20 850,145 680,210 520,170' },
    { id: 4, nome: 'Yasmin e Thalyta', pontos: '70,120 180,170 160,330 30,285' },
    { id: 5, nome: 'Ester', pontos: '180,170 300,150 380,270 280,380 160,330' },
    { id: 6, nome: 'Caroline e Sabrina', pontos: '300,150 520,170 600,320 380,270' },
    { id: 7, nome: 'Amanda e Maria Laura', pontos: '600,320 680,210 850,145 900,300 760,410 500,420 380,270' },
  ];
  const coresMapa = ['#3b82f6', '#eab308', '#22c55e', '#eab308', '#22c55e', '#3b82f6', '#eab308'];

  return <main style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, #26345d 0%, #0b1020 55%, #050711 100%)', padding: '42px 6vw', fontFamily: 'Arial, sans-serif', color: '#fff', overflow: 'hidden' }}>
    <style>{`@keyframes subir { from { transform: translateY(80px) scale(.7); opacity: 0 } 15% { opacity: 1 } to { transform: translateY(-480px) scale(1.15); opacity: 0 } } @keyframes colorir { 0%,100% { fill-opacity: .45 } 50% { fill-opacity: .95 } } .bolha { position: absolute; bottom: 0; border-radius: 999px; animation: subir 5s linear infinite; }`}</style>
    <header style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'space-between', alignItems: 'center', marginBottom: 42 }}><div><p style={{ color: '#aab7e8', letterSpacing: 3, textTransform: 'uppercase', margin: 0 }}>Dinâmica da igreja</p><h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', margin: '10px 0' }}>Apuração <span style={{ color: '#7dd3fc' }}>ao vivo</span></h1><p style={{ color: '#aab7e8', fontSize: 18 }}>Cada bolinha representa um voto confirmado.</p></div><div style={{ color: '#86efac', fontWeight: 700, fontSize: 18 }}>● AO VIVO</div></header>
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 18, maxWidth: 760, marginBottom: 44 }}>
      {[['VOTOS VÁLIDOS', validosExibidos], ['BRANCOS', modoSuspense ? '—' : votos.filter(v => v.tipo === 'branco').length], ['NULOS', modoSuspense ? '—' : votos.filter(v => v.tipo === 'nulo').length]].map(([titulo, total]) => <div key={String(titulo)} style={{ padding: '22px 26px', border: '1px solid #33416e', background: '#131b35cc', borderRadius: 18 }}><div style={{ color: '#aab7e8', fontSize: 13, letterSpacing: 2 }}>{titulo}</div><strong style={{ display: 'block', fontSize: 52, marginTop: 5 }}>{total}</strong></div>)}
    </section>
    <section style={{ marginBottom: 48 }}><h2 style={{ fontSize: 28, marginBottom: 18 }}>Mapa dos discipulados</h2><div style={{ maxWidth: 940, margin: '0 auto', background: '#10182f', border: '1px solid #33416e', borderRadius: 22, padding: 18 }}><svg viewBox="0 0 930 450" style={{ width: '100%', display: 'block' }} role="img" aria-label="Mapa dos discipulados sendo colorido">{regioes.map((regiao, index) => <g key={regiao.id}><polygon points={regiao.pontos} fill={coresMapa[index]} fillOpacity=".82" stroke="#dbeafe" strokeWidth="4" style={{ transition: 'fill 2s, fill-opacity 2s', animation: 'colorir 3s ease-in-out infinite', animationDelay: `${index * .35}s`, filter: `drop-shadow(0 0 8px ${coresMapa[index]})` }} /><text x={index === 6 ? 690 : index === 5 ? 410 : index === 4 ? 220 : index === 3 ? 70 : index === 2 ? 670 : index === 1 ? 390 : 145} y={index === 6 ? 330 : index === 5 ? 245 : index === 4 ? 275 : index === 3 ? 230 : index === 2 ? 120 : index === 1 ? 115 : 90} fill="#fff" textAnchor="middle" fontSize="18" fontWeight="700" style={{ paintOrder: 'stroke', stroke: '#111827', strokeWidth: 4 }}>{regiao.id}</text></g>)}</svg><div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', color: '#c7d2fe', fontSize: 14 }}>{regioes.map((regiao, index) => <span key={regiao.id}><b style={{ color: coresMapa[index] }}>●</b> {regiao.id}. {regiao.nome}</span>)}</div></div></section>
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 42, alignItems: 'end' }}>
      <div><h2 style={{ fontSize: 28, marginBottom: 24 }}>Votos por chapa</h2><div style={{ display: 'grid', gap: 24 }}>{grupos.map(grupo => <div key={grupo.numero}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}><span style={{ fontSize: 20 }}><strong>{grupo.numero}</strong> · {grupo.nome} <small style={{ color: '#aab7e8' }}>({grupo.chapa})</small></span><strong style={{ fontSize: 26 }}>{grupo.total}</strong></div><div style={{ height: 18, background: '#202a4b', borderRadius: 20, overflow: 'hidden' }}><div style={{ width: `${(grupo.total / maior) * 100}%`, height: '100%', background: corDaChapa(grupo.cor), borderRadius: 20, transition: 'width .6s' }} /></div></div>)}</div>{grupos.length === 0 && <p style={{ color: '#aab7e8' }}>Aguardando os primeiros votos...</p>}</div>
      <div style={{ height: 430, position: 'relative', borderBottom: '2px solid #41517e', borderLeft: '1px solid #26345d', overflow: 'hidden' }}>{grupos.flatMap((grupo, grupoIndex) => Array.from({ length: Math.min(grupo.total, 28) }, (_, i) => <span key={`${grupo.numero}-${i}`} className="bolha" style={{ left: `${12 + ((i * 29 + grupoIndex * 17) % 78)}%`, width: 18 + ((i * 7) % 14), height: 18 + ((i * 7) % 14), background: corDaChapa(grupo.cor), boxShadow: `0 0 18px ${corDaChapa(grupo.cor)}`, animationDelay: `${-(i * .35)}s`, animationDuration: `${4.5 + (i % 3)}s` }} />))}<div style={{ position: 'absolute', bottom: 14, width: '100%', textAlign: 'center', color: '#aab7e8', fontSize: 13 }}>VOTOS SUBINDO</div></div>
    </section>
    <p style={{ color: '#7180ad', fontSize: 13, marginTop: 40 }}>Última atualização: {atualizadoEm.toLocaleTimeString('pt-BR')} · painel local</p>
  </main>;
}
