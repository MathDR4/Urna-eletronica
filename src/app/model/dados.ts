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
                [new Foto('lauanny.jpg', 'Foto de Lauanny')],
                'Amarelo'
            ),
            new Candidato(
                17,
                'Manu',
                'Filhos de Deus',
                [new Foto('manu.jpg', 'Foto de Manu')],
                'Verde'
            ),
            new Candidato(
                67,
                'João Arthur',
                'Fortes e Intensos',
                [new Foto('joao-arthur.jpg', 'Foto de João Arthur')],
                'Azul'
            )
        ]
    )
];
