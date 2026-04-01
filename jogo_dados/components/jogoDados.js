"use client";

import { useState } from "react";
import Dado from "./dado";

const TOTAL_RODADAS = 5;
const DADO_INICIAL = 1;

function rolarDado() {
    return Math.floor(Math.random()*6)+1;
}

function calcularResultado(somaJ1, somaJ2) {
    if(somaJ1 > somaJ2) return "ganhou";
    if(somaJ2 > somaJ1) return "perdeu";
    return "empatou";
}

function calcularVencedorFinal(historico) {
    const vitoriasJ1 = historico.filter((r) => r.resultado === "ganhou").length;
    const vitoriasJ2 = historico.filter((r) => r.resultado === "perdeu").length;
    if(vitoriasJ1 > vitoriasJ2) return "Jogador 1 venceu a partida!";
    if(vitoriasJ2 > vitoriasJ1) return "Jogador 2 venceu a partida!";
    return "Empate geral";
}

const estadoInicialJogador = {
    dado1: DADO_INICIAL,
    dado2: DADO_INICIAL,
    soma: 0,
    jogou: false,
};

export default function JogoDados() {
    const [rodadaAtual, setRodadaAtual] = useState(1);
    const [j1, setJ1] = useState({ ... estadoInicialJogador });
    const [j2, setJ2] = useState({ ... estadoInicialJogador });
    const [resultadoAtual, setResultadoAtual] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [jogoFinalizado, setJogoFinalizado] = useState(false);


    function jogarJ1() {
        const d1 = rolarDado();
        const d2 = rolarDado();
        const soma = d1+d2;
        setJ1({ dado1: d1, dado2: d2, soma, jogou: true });
    }

    function jogarJ2() {
        const d1 = rolarDado();
        const d2 = rolarDado();
        const soma = d1+d2;
        setJ2({ dado1: d1, dado2: d2, soma, jogou: true });
        const resultado = calcularResultado(j1.soma, soma);
        setResultadoAtual(resultado);

        const rodada = {
            j1: { dado1: j1.dado1, dado2: j1.dado2, soma: j1.soma },
            j2: { dado1: d1, dado2: d2, soma},
            resultado,
        }

        const novoHistorico = [...historico, rodada];
        setHistorico(novoHistorico);

        if(rodadaAtual >= TOTAL_RODADAS) {
            setJogoFinalizado(true);
        }
    }

    function proximaRodada() {
        setRodadaAtual((r) => r+1);
        setJ1({ ...estadoInicialJogador });
        setJ2({ ...estadoInicialJogador });
        setResultadoAtual(null);
    }

    function reiniciar() {
        setRodadaAtual(1);
        setJ1({ ...estadoInicialJogador });
        setJ2({ ...estadoInicialJogador });
        setResultadoAtual(null);
        setHistorico([]);
        setJogoFinalizado(false);
    }

    const podeJ1Jogar = !j1.jogou && !resultadoAtual;
    const podeJ2Jogar = j1.jogou && !j2.jogou;
    const vitoriasJ1 = historico.filter((r) => r.resultado === "ganhou").length;
    const vitoriasJ2 = historico.filter((r) => r.resultado === "perdeu").length;
    const empates = historico.filter((r) => r.resultado === "empatou").length;

    function textoResultado(resultado, jogador) {
        if (!resultado) return "";
        if (resultado === "empatou") return "Empatou";

        if (jogador === "j1") {
            return resultado === "ganhou" ? "Ganhou!" : "Perdeu!";
        }

        // Jogador 2 (invertido)
        return resultado === "ganhou" ? "Perdeu!" : "Ganhou!";
    }

    return (
        <div className="container">
            <header className="header">
                <h1 className="titulo">Jogo de Dados</h1>
                <div className="rodada">
                    Rodada {Math.min(rodadaAtual, TOTAL_RODADAS)} de {TOTAL_RODADAS}
                </div>
            </header>

            <div className="placarGeral">
                <div className="placarItem j1Cor">
                    <span className="jogadorNome">Jogador 1</span>
                    <span className="placarNumero">{vitoriasJ1}</span>
                </div>
                <div className="placarItem empateCor">
                    <span className="placarNome">Empates</span>
                    <span className="placarNumero">{empates}</span>
                </div>
                <div className="placarItem j2Cor">
                    <span className="placarNome">Jogador 2</span>
                    <span className="placarNumero">{vitoriasJ2}</span>
                </div>
            </div>

            <div className="jogadoresArea">
                <div className={`jogadorCard ${resultadoAtual === "ganhou" ? "vencedor" : resultadoAtual === "perdeu" ? "perdedor" : ""}`}>
                    <h2 className="jogadorNome j1Cor">Jogador 1</h2>
                    <div className="dados">
                        <Dado valor={j1.jogou ? j1.dado1: DADO_INICIAL} />
                        <Dado valor={j1.jogou ? j1.dado2: DADO_INICIAL} />
                    </div>
                    <div className="soma">
                        {j1.jogou ? `Soma: ${j1.soma}` : ""}
                    </div>
                    {resultadoAtual && (
                        <div className={`resultadoRodada ${resultadoAtual}`}>
                            {textoResultado(resultadoAtual, "j1")}
                        </div>
                    )}
                    <button className="btnJogar" onClick={jogarJ1} disabled={!podeJ1Jogar}>
                        Jogar
                    </button>
                </div>
                <div className="vs">VS</div>
                <div className={`jogadorCard ${resultadoAtual === "perdeu" ? "vencedor" : resultadoAtual === "ganhou" ? "perdedor" : "" }`}>
                    <h2 className="jogadorNome j2Cor">Jogador 2</h2>
                    <div className="dados">
                        <Dado valor={j2.jogou ? j2.dado1 : DADO_INICIAL} />
                        <Dado valor={j2.jogou ? j2.dado2 : DADO_INICIAL} />
                    </div>
                    <div className="soma">
                        {j2.jogou ? `Soma: ${j2.soma}` : ""}
                    </div>
                    {resultadoAtual && (
                        <div className={`resultadoRodada ${resultadoAtual === "ganhou" ? "perdeu" : resultadoAtual === "perdeu" ? "ganhou" : "empatou"}`}>
                            {textoResultado(resultadoAtual, "j2")}
                        </div>
                    )}
                    <button className="btnJogar" onClick={jogarJ2} disabled={!podeJ2Jogar}>
                        Jogar
                    </button>
                </div>
                <div className="acoesRodada">
                    {resultadoAtual && !jogoFinalizado && (
                        <button className="btnProxima" onClick={proximaRodada}>
                            Próxima Rodada →
                        </button>
                    )}
                    {jogoFinalizado && (
                        <div className="telaFinal">
                            <div className="resultadoFinal">
                                {calcularVencedorFinal(historico)}
                            </div>
                            <div className="placarFinal">
                                J1: {vitoriasJ1} - Empates: {empates} - J2: {vitoriasJ2}
                            </div>
                            <button className="btnReiniciar" onClick={reiniciar}>
                                Jogar Novamente
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}