export const cidades = {
  jatai: { slug: 'jatai', nome: 'Jataí' },
  goiania: { slug: 'goiania', nome: 'Goiânia' },
} as const;

export type CidadeSlug = keyof typeof cidades;

export function cidadeValida(valor: string | null | undefined): CidadeSlug {
  return valor === 'goiania' ? 'goiania' : 'jatai';
}

export function cidadeAtual(): CidadeSlug {
  if (typeof window === 'undefined') return 'jatai';
  const cidade = cidadeValida(new URLSearchParams(window.location.search).get('cidade'));
  localStorage.setItem('cidade-slug', cidade);
  return cidade;
}

export function linkCidade(caminho: string, cidade: CidadeSlug) {
  return `${caminho}?cidade=${cidade}`;
}
