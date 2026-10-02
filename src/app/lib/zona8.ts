export type ControleZona8 = {
  cidade_slug: string;
  zona8_status: 'aberta' | 'finalizada';
  zona8_12: number;
  zona8_17: number;
  zona8_67: number;
  zona8_ciclo: number;
  zona8_alvo_final: number | null;
  zona8_finalizada_em: string | null;
  zona8_atualizada_em: string;
};

export type VotosZona8 = Record<12 | 17 | 67, number>;

export const DURACAO_REVELACAO_ZONA8_MS = 12000;

export function calcularZona8Exibida(controle: ControleZona8 | null, agora: number): VotosZona8 {
  if (!controle) return { 12: 0, 17: 0, 67: 0 };

  if (
    controle.zona8_status === 'aberta' ||
    !controle.zona8_finalizada_em ||
    controle.zona8_alvo_final === null
  ) {
    return { 12: controle.zona8_12, 17: controle.zona8_17, 67: controle.zona8_67 };
  }

  const inicio = new Date(controle.zona8_finalizada_em).getTime();
  const progresso = Math.min(1, Math.max(0, (agora - inicio) / DURACAO_REVELACAO_ZONA8_MS));
  const alvo = controle.zona8_alvo_final;
  const interpolar = (valorInicial: number) =>
    progresso >= 1 ? alvo : Math.min(alvo, Math.round(valorInicial + (alvo - valorInicial) * progresso));

  return {
    12: interpolar(controle.zona8_12),
    17: interpolar(controle.zona8_17),
    67: interpolar(controle.zona8_67),
  };
}

export function revelacaoZona8Concluida(controle: ControleZona8 | null, agora: number): boolean {
  if (!controle || controle.zona8_status !== 'finalizada' || !controle.zona8_finalizada_em) return false;
  return agora - new Date(controle.zona8_finalizada_em).getTime() >= DURACAO_REVELACAO_ZONA8_MS;
}
