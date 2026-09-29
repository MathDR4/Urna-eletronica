import styled, { css, keyframes } from 'styled-components';

export const UrnaEletronica = styled.div(({ theme }) => (css`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    background-color: ${theme.colors.primary};
    padding: 0 60px 0 60px;
    align-items: end;
    border-radius: 6px;
    border: 1px solid #A8A79D;
    position: relative;
`));

export const Tela = styled.div`
    width: 680px;
    height: 320px;
    display: flex;
    flex-direction: column;
`;

export const AreaVotacao = styled.div`
    flex: 1;
    display: flex;
    padding: 18px 24px;
    background: #fff;
    margin-top: 5px;
    color: #111;
`;

export const CargoVotacao = styled.div(({ theme }) => (css`
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    font-size: 22px;
    font-weight: 700;
    color: #111;
`));

export const DisplayNumero = styled.div`
    display: flex;
    height: 40px;
`;

export const Numero = styled.div(({ theme }) => (css`
    display: inline-block;
    width: 30px;
    height: 40px;
    border: 1px solid ${theme.colors.dark};
    text-align: center;
    line-height: 40px;
    font-size: ${theme.fontSizes.h4};
`));


export const NumeroPisca = styled.div`
    animation-name: pisca;
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
`;

export const Legenda = styled.div(({ theme }) => (css`
    height: 50px;
    font-size: ${theme.fontSizes.body};
    border-top: 3px solid #000;
    padding-left: 10px;
    margin-top: 30px;
`));

export const TituloVotacao = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 4px 8px 8px;
    color: #111;
    font-size: 13px;
    font-weight: 700;
`;

export const InformacoesEsquerda = styled.div(({ theme }) => (css`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
    height: 255px;
    background-color: ${theme.colors.light};
    color: #111;
`));

export const InformacoesDireita = styled.div(({ theme }) => (css`
    width: 110px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    background: ${theme.colors.light};
`));

export const CardCandidato = styled.div(({ theme }) => (css`
    background-color: ${theme.colors.light};
    text-align: center;
    font-size: ${theme.fontSizes.body};
`));

export const CardVicePrefeito = styled.div`
    background-color: #FFF;
    text-align: center;
    font-size: 12px;
    margin-top: 2px;
    width: 80%;
`;

export const Imagem = styled.img`
    width: 100%;
`;

export const EspacoFoto = styled.div`
    width: 86px;
    height: 96px;
    margin: 0 auto 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #9a9a9a;
    background: #f4f4f4;
    color: #777;
    font-size: 12px;
    font-weight: 700;
`;

export const Braille = styled.img<{ cor?: 'branco' | 'corrige' | 'confirma' }>`
    width: 30px;
    height: 20px;
    position: absolute;
    top: 10px;
    right: 15px;
    mix-blend-mode: color-burn;

    ${({ cor }) => {
        switch (cor) {
            case 'branco':
                return css`
                    mix-blend-mode: darken;
                    width: 74px;
                    height: 15px;
                    top: 19px;
                    right: 7px;
                `;
            case 'corrige':
                return css`
                    mix-blend-mode: darken;
                    width: 77px;
                    height: 15px;
                    top: 19px;
                    right: 5px;
                `;
            case 'confirma':
                return css`
                    mix-blend-mode: darken;
                    width: 85px;
                    height: 15px;
                    top: 28px;
                    right: 0px;
                `;
            default:
                return css``; // Estilo padrão, se necessário
        }
    }}
`;

export const Teclado = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 30px;
    width: 410px;
    margin-top: 40px;
    margin-bottom: 40px;
`;

export const Linha = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
`;

export const ContainerNumeros = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ContainerAcoes = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

export const CardInformacoes = styled.div`
    display: flex;
    min-height: 125px;
`;

export const ListaInformacoes = styled.div(({ theme }) => (css`
    list-style: none;
    font-size: ${theme.fontSizes.large};
    min-width: 100px;
    align-items: self-start;
    display: flex;
    flex-direction: column;
    justify-content: center;

    li {
        margin-bottom: 15px;
        padding-left: 5px;
    }

    li:first-child {
        margin-top: 10px;
        margin-bottom: 25px;
    }
`));

export const ListaDetalhesInformacoes = styled.ul`
    list-style: none;
    color: #111;
    font-size: 16px;

    li:first-child {
        margin-top: 0;
    }

    li {
        margin-top: 15px;
    }

    li:last-child {
        font-weight: 700;
    }
`;

const pisca = keyframes`
  0% { 
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% { 
    opacity: 0.2;
  }
`;

export const CardVotoEmBranco = styled.div(({ theme }) => (css`
    display: flex;
    justify-content: center;
    padding: 35px;
    margin-bottom: 8px; 
    font-size: ${theme.fontSizes.h2};
    font-weight: 700;
    animation-name: ${pisca};
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
`));

export const CardVotoNulo = styled.div(({ theme }) => (css`
    display: flex;
    justify-content: center;
    padding: 35px;
    margin-bottom: 8px;
    font-size: ${theme.fontSizes.h2};
    font-weight: 700;
`));

export const CardFimVotacao = styled.div(({ theme }) => (css`
    display: flex;
    justify-content: center;
    padding: 35px;
    margin-bottom: 8px;
    font-size: ${theme.fontSizes.h1};
    font-weight: 700;
    background: #fff;
    width: 100%;
    align-items: center;
    flex-direction: column;
    gap: 24px;
`));

export const BotaoProximoVoto = styled.button`
    border: 0;
    border-radius: 6px;
    padding: 14px 24px;
    background: #48c079;
    color: #111;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;

    &:hover {
        filter: brightness(0.92);
    }
`;

