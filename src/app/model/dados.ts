import { Candidato } from "./candidato";
import { Etapa } from "./etapa";
import { Foto } from "./foto";

export const dados: Etapa[] = [
    new Etapa(1, 'Chapa', 2,
        [
            new Candidato(
                12,
                'Lauanny',
                'Somos Um',
                [],
                'Amarelo'
            ),
            new Candidato(
                17,
                'Manu',
                'Filhos de Deus',
                [],
                'Verde'
            ),
            new Candidato(
                67,
                'João Arthur',
                'Fortes e Intensos',
                [],
                'Azul'
            )
        ]
    )
];
