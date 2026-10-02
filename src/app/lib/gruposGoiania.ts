import { GrupoDiscipulado } from './gruposDiscipulado';

const nomes = (genero: 'menino' | 'menina', lista: string[], prefixo: string, regiaoId: 1 | 2 | 3 | 4 | 5 | 6 | 7): GrupoDiscipulado[] => lista.map((nome, i) => ({
  id: `${prefixo}-${i + 1}`,
  nome,
  genero,
  regiaoId,
  formacoes: ['Goiânia'],
}));

export const gruposGoiania: GrupoDiscipulado[] = [
  ...nomes('menino', ['Marcelinho', 'Vitor Hugo IMS', 'Edson', 'Fábio', 'Pedro Campos', 'Carioca', 'Pr. Léo', 'William', 'Felipe Castro', 'Cleiton', 'Bragato'], 'gyn-m1', 1),
  ...nomes('menina', ['Matyldes', 'Júlia Tagliavinni', 'Cris', 'Ester Fued', 'Déborah Lyssa', 'Natasha', 'Nicole Mylek', 'Isabelle', 'Marcela Sales', 'Sara B.', 'Anna Bia Fup', 'Laura P.', 'Pra. Tetê', 'Júlia Caetano'], 'gyn-f1', 2),
  ...nomes('menino', ['João Paulo', 'Beleli', 'Lemes', 'Vitin NB', 'Guiotti', 'Vicente', 'Asaf', 'Orlando', 'Isaac', 'Pedro da teia', 'Erick'], 'gyn-m2', 3),
  ...nomes('menina', ['Andressa Eliza', 'Nathalia Gad', 'Joana', 'Luaninha', 'Iorrana', 'Yasmin Gomes', 'Luana Marques', 'Liz', 'Maressa', 'Wanessa', 'Déborah Crisóstomo', 'Isabella Rocha', 'Lara', 'Rebecca Rocha'], 'gyn-f2', 4),
  ...nomes('menino', ['João Eduardo', 'PH', 'Maia', 'Pequeno', 'Gustavo Alencar', 'Gustavo Teixeira', 'Arthur', 'Nicolas', 'Jhon', 'Emanuel', 'Vitor Rocha', 'Matheus Bruno'], 'gyn-m3', 5),
  ...nomes('menina', ['Mel', 'Gabi Rodrigues', 'Alice Ale', 'Ana Laura Costa', 'Malu', 'Clara Duarte', 'Ana Laura Anjos', 'Valentina Craveiro', 'Bruna Rauanny', 'Lorrany', 'Debora Maia', 'Milena Maia', 'Fernanda Rodrigues', 'Fernanda Salles'], 'gyn-f3', 6),
];
