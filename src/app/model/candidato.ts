import { Foto } from "./foto";

// Classe para Candidato
export class Candidato {
    numero: number;
    nome: string;
    partido: string;
    cor: string;
    fotos: Foto[];

    constructor(numero: number, nome: string, partido: string, fotos: Foto[], cor: string = '') {
        this.numero = numero;
        this.nome = nome;
        this.partido = partido;
        this.cor = cor;
        this.fotos = fotos;
    }
}
