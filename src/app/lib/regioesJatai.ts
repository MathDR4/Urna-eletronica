import { gruposDiscipulado, RegiaoDiscipuladoId } from '@/app/lib/gruposDiscipulado';

export type RegiaoJataiId = RegiaoDiscipuladoId;

export type RegiaoJatai = {
  id: RegiaoJataiId;
  nome: string;
  formacao: string;
};

export const regioesJatai: RegiaoJatai[] = [
  { id: 1, nome: 'Pastor e Pedro', formacao: 'Pr. Rafa e Dc. Pedro' },
  { id: 2, nome: 'Júnio e Duarte', formacao: 'Dc. Junio e Dc. Matheus' },
  { id: 3, nome: 'William e Felipe', formacao: 'Dc. Felipe e Dc. Willian' },
  { id: 4, nome: 'Yasmin e Thalyta', formacao: 'Dc. Y. Moraes e Dc. Thalyta' },
  { id: 5, nome: 'Ester', formacao: 'Dc. Ester' },
  { id: 6, nome: 'Caroline e Sabrina', formacao: 'Dc. Carole e Dc. Sabrina' },
  { id: 7, nome: 'Amanda e Maria Laura', formacao: 'A. Borges e M. Laura' },
];

const grupoPorNome = new Map(gruposDiscipulado.map(grupo => [grupo.nome, grupo]));
const regiaoPorFormacao = new Map(regioesJatai.map(regiao => [regiao.formacao, regiao.id]));
const regiaoPorNome = new Map(regioesJatai.map(regiao => [regiao.nome, regiao.id]));
const SUFIXO_FORMACAO = ' — Formação';

export function obterRegiaoDoDiscipulado(discipulado: string | null | undefined): RegiaoJataiId | null {
  if (!discipulado) return null;

  const valor = discipulado.trim();

  // O painel do mesário grava uma formação como, por exemplo,
  // "Pr. Rafa e Dc. Pedro — Formação". Nesse caso o voto deve
  // pontuar diretamente para a zona do discipulado maior.
  const valorSemSufixo = valor.endsWith(SUFIXO_FORMACAO)
    ? valor.slice(0, -SUFIXO_FORMACAO.length).trim()
    : valor;

  const regiaoDireta = regiaoPorFormacao.get(valorSemSufixo) ?? regiaoPorNome.get(valorSemSufixo);
  if (regiaoDireta) return regiaoDireta;

  // Para os discipulados menores, usa o vínculo explícito do cadastro.
  return grupoPorNome.get(valor)?.regiaoId ?? grupoPorNome.get(valorSemSufixo)?.regiaoId ?? null;
}

export function corHexDaChapa(cor: string): string {
  return ({
    Amarelo: '#eab308',
    Verde: '#22c55e',
    Azul: '#3b82f6',
  } as Record<string, string>)[cor] || '#64748b';
}

function hexParaRgb(hex: string) {
  const valor = hex.replace('#', '');
  return {
    r: parseInt(valor.slice(0, 2), 16),
    g: parseInt(valor.slice(2, 4), 16),
    b: parseInt(valor.slice(4, 6), 16),
  };
}

function rgbParaHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map(valor => Math.round(valor).toString(16).padStart(2, '0')).join('')}`;
}

export function aplicarIntensidade(cor: string, intensidade: number): string {
  const neutra = hexParaRgb('#334155');
  const destino = hexParaRgb(cor);
  const fator = Math.max(0, Math.min(1, intensidade));
  return rgbParaHex(
    neutra.r + (destino.r - neutra.r) * fator,
    neutra.g + (destino.g - neutra.g) * fator,
    neutra.b + (destino.b - neutra.b) * fator,
  );
}
