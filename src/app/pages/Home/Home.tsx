"use client";

import { CargoVotacao, DisplayNumero, InformacoesEsquerda, InformacoesDireita, Legenda, Numero, NumeroPisca, Tela, UrnaEletronica, AreaVotacao, CardCandidato, CardVicePrefeito, Imagem, EspacoFoto, Linha, Teclado, ContainerNumeros, ContainerAcoes, TituloVotacao, ListaInformacoes, CardInformacoes, ListaDetalhesInformacoes, Braille, CardVotoEmBranco, CardFimVotacao, BotaoProximoVoto, CardVotoNulo } from "./styles";
import { useEffect, useRef, useState } from "react";
import Braille1 from '../../assets/imagens/braille/braille1.png';
import Braille2 from '../../assets/imagens/braille/braille2.png';
import Braille3 from '../../assets/imagens/braille/braille3.png';
import Braille4 from '../../assets/imagens/braille/braille4.png';
import Braille5 from '../../assets/imagens/braille/braille5.png';
import Braille6 from '../../assets/imagens/braille/braille6.png';
import Braille7 from '../../assets/imagens/braille/braille7.png';
import Braille8 from '../../assets/imagens/braille/braille8.png';
import Braille9 from '../../assets/imagens/braille/braille9.png';
import Braille0 from '../../assets/imagens/braille/braille0.png';
import Branco from '../../assets/imagens/braille/branco.png';
import Corrige from '../../assets/imagens/braille/corrige.png';
import Confirma from '../../assets/imagens/braille/confirma.png';
import { Botao } from "@/app/components/Botao/Botao";
import { Etapa } from "@/app/model/etapa";
import { Candidato } from "@/app/model/candidato";
import audioDigitoUrna from '../../assets/sons/digito-urna.mp3';
import audioConfirmaUrna from '../../assets/sons/confirma-urna.mp3';
import { Audio } from "@/app/components/Audio/Audio";
import { dados as dadosEleicao} from "@/app/model/dados";
import { dadosGoiania } from "@/app/model/dadosGoiania";
import { supabase } from "@/app/lib/supabase";
import { cidadeAtual } from "@/app/lib/cidades";

const CHAVE_REGISTRO_VOTOS = 'urna-igreja-votos';

type RegistroVoto = {
    id: string;
    numero: number | null;
    nome: string;
    chapa: string;
    cor: string;
    tipo: 'válido' | 'branco' | 'nulo';
    dataHora: string;
};

const Home = () => {

    const cidade = typeof window !== 'undefined' && (window.location.pathname.startsWith('/goiania/') || new URLSearchParams(window.location.search).get('cidade') === 'goiania') ? 'goiania' : 'jatai';
    const dados: Etapa[] = cidade === 'goiania' ? dadosGoiania : dadosEleicao;
    const [numeros, setNumeros] = useState<number[]>(Array(dados[0].numeros).fill(null));
    const [etapaVoto, setEtapaVoto] = useState(dados[0].etapa);
    const [candidato, setCandidato] = useState<Candidato | null>(null);
    const [textoCargoVotacao, setTextoCargoVotacao] = useState<string>(dados[0].titulo);
    const [votoEmBranco, setVotoEmBranco] = useState<boolean>(false);
    const [votoNulo, setVotoNulo] = useState<boolean>(false);
    const [finalizouVotacao, setFinalizouVotacao] = useState<boolean>(false);
    const [sessaoLiberada, setSessaoLiberada] = useState<any>(null);
    const [possuiVicePrefeito, setVicePrefeito] = useState<boolean>(false);
    const [votos, setVotos] = useState<RegistroVoto[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            return JSON.parse(localStorage.getItem(CHAVE_REGISTRO_VOTOS) || '[]');
        } catch {
            return [];
        }
    });
    const audioRefDigitoUrna = useRef<{ playAudio: () => void, pausarAudio: () => void } | null>(null);
    const audioRefConfirmaUrna = useRef<{ playAudio: () => void, pausarAudio: () => void } | null>(null);

    useEffect(() => {
        try {
            const cidade = cidadeAtual();
            const direto = cidade === 'goiania' && (new URLSearchParams(window.location.search).get('direto') === '1' || window.location.pathname === '/goiania/urna' || window.location.pathname === '/goiania/entrada');
            if (direto) {
                setSessaoLiberada({ cidade_slug: cidade, status: 'liberada', direto: true });
                return;
            }
            if (!localStorage.getItem('estacao-id')) {
                window.location.href = `/configurar-urna?cidade=${cidade}`;
                return;
            }
            const sessao = JSON.parse(localStorage.getItem('urna-sessao') || 'null');
            if (!sessao?.id || sessao.status !== 'liberada') { localStorage.removeItem('urna-sessao'); return; }
            if (!supabase) { localStorage.removeItem('urna-sessao'); return; }
            supabase.from('sessoes_votacao').select('*').eq('id', sessao.id).eq('cidade_slug', cidade).eq('status', 'liberada').maybeSingle().then(({ data }) => {
                if (data) setSessaoLiberada(data);
                else localStorage.removeItem('urna-sessao');
            });
        } catch { setSessaoLiberada(null); }
    }, []);

    const clicou = (digito: number) => {
        const novosNumeros = [...numeros];
        const posicaoVazia = novosNumeros.findIndex(num => num === null);
        if (posicaoVazia !== -1) {
            setCandidato(null);
            setVotoNulo(false);
            setVotoEmBranco(false);
            novosNumeros[posicaoVazia] = digito;
            setNumeros(novosNumeros);
            audioRefDigitoUrna.current?.playAudio();
            if(posicaoVazia === dados[0].numeros - 1) {
                const dadosVotacao = dados.find(d => d.etapa === etapaVoto);
                const numerosCandidato = Number((novosNumeros.filter(num => num !== null) as number[]).join(''));
                const candidato = dadosVotacao?.candidatos.find(d => d.numero === numerosCandidato);
                if(candidato) {
                    setCandidato(candidato);
                    setVicePrefeito(false);
                } else {
                    setVotoNulo(true);
                }
            }
        }
    };

    const branco = () => {
        const numerosCandidato = Number((numeros.filter(num => num !== null) as number[]).join(''));
        if((numerosCandidato) && (numerosCandidato > 0)) {
            alert('Para votar em branco, por favor não digite nenhum número!');
        } else {
            const dadosVotacao = dados.find(d => d.etapa === etapaVoto);
            setEtapaVoto(dadosVotacao!.etapa);
            setNumeros(Array(dadosVotacao?.numeros).fill(null));
            setCandidato(null);
            setTextoCargoVotacao(dadosVotacao!.titulo);
            setVotoEmBranco(true);
            setVotoNulo(false);
        }
    };

    const corrige = () => {
        setEtapaVoto(dados[0].etapa);
        setNumeros(Array(dados[0].numeros).fill(null));
        setCandidato(null);
        setTextoCargoVotacao(dados[0].titulo);
        setVotoEmBranco(false);
        setVotoNulo(false);
        setVicePrefeito(false);
    };

    const confirma = async () => {
        audioRefConfirmaUrna.current?.playAudio();

        const numeroDigitado = Number((numeros.filter(num => num !== null) as number[]).join(''));
        const registro: RegistroVoto = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            numero: candidato ? candidato.numero : numeroDigitado || null,
            nome: candidato?.nome || '',
            chapa: candidato?.partido || '',
            cor: candidato?.cor || '',
            tipo: votoEmBranco ? 'branco' : votoNulo || !candidato ? 'nulo' : 'válido',
            dataHora: new Date().toISOString(),
        };
        const registrosAtualizados = [...votos, registro];
        setVotos(registrosAtualizados);
        localStorage.setItem(CHAVE_REGISTRO_VOTOS, JSON.stringify(registrosAtualizados));

        if (supabase) {
            const estacaoId = localStorage.getItem('estacao-id');
            const urnaConfigurada = localStorage.getItem('urna-configurada');
            const cidade = cidadeAtual();
            const { error } = await supabase.from('votos').insert({
                cidade_slug: cidade,
                numero: registro.numero,
                nome: registro.nome,
                chapa: registro.chapa,
                cor: registro.cor,
                tipo: registro.tipo,
                data_hora: registro.dataHora,
                estacao_id: estacaoId || null,
                urna_numero: urnaConfigurada ? Number(urnaConfigurada) : null,
            });
            if (error) {
                console.error('Não foi possível registrar o voto no Supabase:', error);
                alert('Não foi possível registrar o voto. A urna continuará aberta para tentar novamente.');
                return;
            }
            if (sessaoLiberada?.id) {
                await supabase.from('sessoes_votacao').update({ status: 'consumida', consumida_em: new Date().toISOString() }).eq('id', sessaoLiberada.id);
            }
        }

        localStorage.removeItem('urna-sessao');
        setSessaoLiberada(null);

        setFinalizouVotacao(false);
        setVotoEmBranco(false);
        setVotoNulo(false);
        window.setTimeout(() => { window.location.href = `/entrada?cidade=${cidadeAtual()}`; }, 900);
    };

    const proximoVoto = () => {
        setFinalizouVotacao(false);
        setEtapaVoto(dados[0].etapa);
        setNumeros(Array(dados[0].numeros).fill(null));
        setCandidato(null);
        setTextoCargoVotacao(dados[0].titulo);
        setVotoEmBranco(false);
        setVotoNulo(false);
        setVicePrefeito(false);
    };

    if (!sessaoLiberada) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#111827', color: '#fff', fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: 24 }}><div><h1>Urna aguardando liberação</h1><p>Informe seu discipulado na tela de entrada e aguarde o mesário liberar uma urna.</p><a href={`/entrada?cidade=${typeof window === 'undefined' ? 'jatai' : cidadeAtual()}`} style={{ color: '#93c5fd' }}>Ir para identificação</a></div></div>;

    return (
        <>
            <UrnaEletronica>
                <Tela>
                    <AreaVotacao>
                        {!finalizouVotacao ? (
                            <>
                                <InformacoesEsquerda>
                                    <TituloVotacao>
                                        <span>SEU VOTO PARA</span>
                                    </TituloVotacao>
                                    <CargoVotacao>
                                        <span>{ textoCargoVotacao }</span>
                                    </CargoVotacao>
                                    {!votoEmBranco && !votoNulo ? (
                                        <CardInformacoes>
                                            <ListaInformacoes>
                                                <li>Número:</li>
                                                <li>Nome:</li>
                                                <li>Chapa:</li>
                                                <li>Cor:</li>
                                            </ListaInformacoes>
                                            <ListaDetalhesInformacoes>
                                                <li>
                                                    <DisplayNumero>
                                                        <NumeroPisca></NumeroPisca>
                                                        {numeros.map((numero, index) => (
                                                            <Numero key={index}>{numero}</Numero>
                                                        ))}
                                                    </DisplayNumero>
                                                </li>
                                                <li>
                                                    { candidato?.nome || ''}
                                                </li>
                                                <li>
                                                    { candidato?.partido || ''}
                                                </li>
                                                <li>
                                                    { candidato?.cor || ''}
                                                </li>
                                            </ListaDetalhesInformacoes>
                                        </CardInformacoes>
                                    ) : null}
                                    
                                    {votoEmBranco ? (
                                        <CardVotoEmBranco>
                                            VOTO EM BRANCO
                                        </CardVotoEmBranco>
                                    ) : votoNulo ? (
                                        <CardVotoNulo>
                                            VOTO NULO
                                        </CardVotoNulo>
                                    ) : null}
                                    <Legenda>
                                        Aperta a tecla: <br/>
                                        CONFIRMA para CONFIRMAR este voto.<br/>
                                        CORRIGE para CORRIGIR este voto.
                                    </Legenda>
                                </InformacoesEsquerda>
                                <InformacoesDireita>
                                    { candidato ? (
                                        <CardCandidato>
                                            {candidato.fotos[0]?.url ? (
                                                <Imagem
                                                    src={`/candidatos/${cidade}/${candidato.fotos[0].url}`}
                                                    alt={candidato.fotos[0].legenda}
                                                />
                                            ) : <EspacoFoto>FOTO</EspacoFoto>}
                                            Chapa
                                        </CardCandidato>
                                    ) : null}
                                    
                                    { possuiVicePrefeito ? (
                                        <CardVicePrefeito>
                                            <Imagem 
                                                src={`candidatos/vice-prefeito/${candidato?.fotos[1]?.url}`}
                                                alt={candidato?.fotos[1]?.legenda}
                                            ></Imagem>
                                            Vice-prefeito
                                        </CardVicePrefeito>
                                    ) : null }
                                </InformacoesDireita>
                            </>
                        ) : (
                            <CardFimVotacao>
                                FIM
                                <BotaoProximoVoto onClick={proximoVoto}>
                                    PRÓXIMO VOTO
                                </BotaoProximoVoto>
                            </CardFimVotacao>
                        )}
                    </AreaVotacao>
                </Tela>
                <Teclado>
                    <ContainerNumeros>
                        <Linha>
                            <Botao onClick={() => clicou(1)}>1<Braille src={Braille1.src}></Braille></Botao>
                            <Botao onClick={() => clicou(2)}>2<Braille src={Braille2.src}></Braille></Botao>
                            <Botao onClick={() => clicou(3)}>3<Braille src={Braille3.src}></Braille></Botao>
                        </Linha>
                        <Linha>
                            <Botao onClick={() => clicou(4)}>4<Braille src={Braille4.src}></Braille></Botao>
                            <Botao onClick={() => clicou(5)}>5<Braille src={Braille5.src}></Braille></Botao>
                            <Botao onClick={() => clicou(6)}>6<Braille src={Braille6.src}></Braille></Botao>
                        </Linha>
                        <Linha>
                            <Botao onClick={() => clicou(7)}>7<Braille src={Braille7.src}></Braille></Botao>
                            <Botao onClick={() => clicou(8)}>8<Braille src={Braille8.src}></Braille></Botao>
                            <Botao onClick={() => clicou(9)}>9<Braille src={Braille9.src}></Braille></Botao>
                        </Linha>
                        <Linha>
                            <Botao onClick={() => clicou(0)}>0<Braille src={Braille0.src}></Braille></Botao>
                        </Linha>
                    </ContainerNumeros>
                    <ContainerAcoes>
                        <Linha style={{flexDirection: 'column'}}>
                            <Botao cor="branco" onClick={() => branco()}>BRANCO<Braille src={Branco.src} cor="branco"></Braille></Botao>
                            <Botao cor="corrige" onClick={() => corrige()}>CORRIGE<Braille src={Corrige.src} cor="corrige"></Braille></Botao>
                            <Botao cor="confirma" onClick={() => confirma()}>CONFIRMA<Braille src={Confirma.src} cor="confirma"></Braille></Botao>
                        </Linha>
                    </ContainerAcoes>
                </Teclado>
                <Audio ref={audioRefDigitoUrna} src={audioDigitoUrna} />
                <Audio ref={audioRefConfirmaUrna} src={audioConfirmaUrna} />
            </UrnaEletronica>
        </>
    )
};

export default Home;
