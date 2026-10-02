export type GeneroGrupo = 'menino' | 'menina';
export type RegiaoDiscipuladoId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type GrupoDiscipulado = {
  id: string;
  nome: string;
  genero: GeneroGrupo;
  regiaoId: RegiaoDiscipuladoId;
  formacoes: string[];
};

const formacaoPorRegiao: Record<RegiaoDiscipuladoId, string> = {
  1: 'Pr. Rafa e Dc. Pedro',
  2: 'Dc. Junio e Dc. Matheus',
  3: 'Dc. Felipe e Dc. Willian',
  4: 'Dc. Y. Moraes e Dc. Thalyta',
  5: 'Dc. Ester',
  6: 'Dc. Carole e Dc. Sabrina',
  7: 'A. Borges e M. Laura',
};

const grupo = (
  id: string,
  nome: string,
  genero: GeneroGrupo,
  regiaoId: RegiaoDiscipuladoId,
): GrupoDiscipulado => ({
  id,
  nome,
  genero,
  regiaoId,
  formacoes: [formacaoPorRegiao[regiaoId]],
});

export const gruposDiscipulado: GrupoDiscipulado[] = [
  // Zona 1 — Pastor e Pedro
  grupo('felipe-garcia-jose-flavio', 'Dc. Felipe Garcia e José Flávio', 'menino', 1),
  grupo('william-andre', 'Dc. William e André', 'menino', 1),
  grupo('matheus-duarte-jander', 'Dc. Matheus Duarte e Jander', 'menino', 1),
  grupo('matheus-melo-lucas-reis', 'Matheus Melo e Lucas Reis', 'menino', 1),
  grupo('tarik', 'Tárik', 'menino', 1),

  // Zona 2 — Júnio e Duarte
  grupo('daniel-kalebe-guilherme', 'Daniel Kalebe e Guilherme', 'menino', 2),
  grupo('danthe-carlos', 'Dc. Danthe e Carlos', 'menino', 2),
  grupo('wallace-alaor', 'Wallace e Alaor', 'menino', 2),
  grupo('gabriel-souza-marcos-vaz', 'Gabriel Souza e Marcos Vaz', 'menino', 2),
  grupo('gabriel-moraes-gabriel-jesus', 'Gabriel Moraes e Gabriel de Jesus', 'menino', 2),
  grupo('pedro-gustavo', 'Dc. Pedro e Gustavo', 'menino', 2),

  // Zona 3 — William e Felipe
  grupo('joao-pedro-naves-daniel-wagner', 'João Pedro Naves e Daniel Wagner', 'menino', 3),
  grupo('mateus-gabriel-palacio', 'Mateus e Gabriel Palácio', 'menino', 3),

  // Zona 4 — Yasmin e Thalyta
  grupo('jessica-paula', 'Jéssica e Paula', 'menina', 4),
  grupo('phublyane-anna-gabriella', 'Phublyane e Anna Gabriella', 'menina', 4),
  grupo('tamires-ester-rodrigues', 'Tamires e Ester Rodrigues', 'menina', 4),
  grupo('gama-sara-franco', 'Gama e Sara Franco', 'menina', 4),
  grupo('roberta-diuliana', 'Roberta e Diuliana', 'menina', 4),
  grupo('bianca-debora', 'Bianca e Débora', 'menina', 4),

  // Zona 5 — Ester
  grupo('thalyta-l', 'Dc. Thalyta L', 'menina', 5),
  grupo('maria-laura-elisa', 'Maria Laura e Elisa', 'menina', 5),
  grupo('isadora-leticia-magalhaes', 'Isadora e Letícia Magalhães', 'menina', 5),
  grupo('fernanda-manu', 'Fernanda e Manu', 'menina', 5),
  grupo('vitoria-ferreira-lorrana', 'Vitória Ferreira e Lorrana', 'menina', 5),

  // Zona 6 — Caroline e Sabrina
  grupo('amanda-g-brenda', 'Amanda G. e Brenda', 'menina', 6),
  grupo('vitoria-lima-ana-clara', 'Vitória Lima e Ana Clara', 'menina', 6),
  grupo('y-bastos-luana', 'Y. Bastos e Luana', 'menina', 6),
  grupo('ana-lia-ester-machado', 'Ana Lia e Ester Machado', 'menina', 6),
  grupo('y-moraes-beatriz', 'Dc. Y. Moraes e Beatriz', 'menina', 6),

  // Zona 7 — Amanda e Maria Laura
  grupo('sophia-m-sabrina', 'Sophia M. e Sabrina', 'menina', 7),
  grupo('taisa-lia', 'Taísa e Lia', 'menina', 7),
  grupo('emily-maria-eugenia', 'Emily e Maria Eugenia', 'menina', 7),
  grupo('thais-gaminha', 'Thaís e Gaminha', 'menina', 7),
];
