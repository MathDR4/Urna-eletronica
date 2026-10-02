import { Candidato } from './candidato';
import { Etapa } from './etapa';
import { Foto } from './foto';

export const dadosGoiania: Etapa[] = [
  new Etapa(1, 'Chapa', 2, [
    new Candidato(88, 'Lucas Ganzerli', 'Partido Braço Forte', [new Foto('lucas-ganzerli.png', 'Foto de Lucas Ganzerli')], '#d7ff00'),
    new Candidato(75, 'Samuel', 'Partido Avivador', [new Foto('samuel.png', 'Foto de Samuel')], '#7cff00'),
    new Candidato(67, 'Maria Eduarda', 'Partido Valente', [new Foto('maria-eduarda.png', 'Foto de Maria Eduarda')], '#18bfff'),
  ]),
];
