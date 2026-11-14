import { describe, expect, it } from "vitest";

import { analisarHabitos } from "../habitos";

describe("IA Local V1 - Analisador de Hábitos", () => {
  function criarMetricas(taxaHabitos: number | null, diasRegistrados = 7) {
    return {
      diasRegistrados,

      estudoMinutos: 0,
      diasComEstudo: 0,

      sonoMedia: null,
      diasComSono: 0,

      aguaMedia: null,
      diasComAgua: 0,

      cigarrosMedia: null,
      diasComCigarros: 0,

      habitosConcluidos: 0,
      habitosPossiveis: 0,
      taxaHabitos,
    };
  }

  it("deve retornar null quando não existe taxa de hábitos", () => {
    const atual = criarMetricas(null);
    const anterior = criarMetricas(80);

    const resultado = analisarHabitos(atual, anterior);

    expect(resultado).toBeNull();
  });

  it("deve gerar Insight quando a taxa de hábitos aumenta mais de 10 pontos", () => {
    const atual = criarMetricas(80);
    const anterior = criarMetricas(60);

    const resultado = analisarHabitos(atual, anterior);

    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("habitos");
    expect(resultado?.mensagem).toContain("aumentou");
    expect(resultado?.evidencias[0].valorAtual).toBe(80);
    expect(resultado?.evidencias[0].valorAnterior).toBe(60);
    expect(resultado?.evidencias[0].diferencaPercentual).toBe(20);
  });

  it("deve gerar Insight quando a taxa de hábitos cai mais de 10 pontos", () => {
    const atual = criarMetricas(50);
    const anterior = criarMetricas(70);

    const resultado = analisarHabitos(atual, anterior);

    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("habitos");
    expect(resultado?.mensagem).toContain("caiu");
    expect(resultado?.evidencias[0].valorAtual).toBe(50);
    expect(resultado?.evidencias[0].valorAnterior).toBe(70);
    expect(resultado?.evidencias[0].diferencaPercentual).toBe(-20);
  });

  it("não deve gerar Insight de aumento com exatamente 10 pontos", () => {
    const atual = criarMetricas(70, 5);
    const anterior = criarMetricas(60, 5);

    const resultado = analisarHabitos(atual, anterior);

    expect(resultado).toBeNull();
  });

  it("não deve gerar Insight de queda com exatamente 10 pontos", () => {
    const atual = criarMetricas(50, 5);
    const anterior = criarMetricas(60, 5);

    const resultado = analisarHabitos(atual, anterior);

    expect(resultado).toBeNull();
  });

  it("deve gerar Insight quando a taxa de hábitos atinge 90%", () => {
    const atual = criarMetricas(90);
    const anterior = criarMetricas(90);

    const resultado = analisarHabitos(atual, anterior);

    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("habitos");
    expect(resultado?.pontuacao).toBe(85);
    expect(resultado?.mensagem).toContain("90%");
    expect(resultado?.evidencias[0].valorAtual).toBe(90);
  });

  it("deve gerar Insight quando a taxa de hábitos supera 90%", () => {
    const atual = criarMetricas(95);
    const anterior = criarMetricas(95);

    const resultado = analisarHabitos(atual, anterior);

    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("habitos");
    expect(resultado?.pontuacao).toBe(85);
    expect(resultado?.mensagem).toContain("95%");
  });

  it("deve retornar null quando nenhum critério for atingido", () => {
    const atual = criarMetricas(70, 5);
    const anterior = criarMetricas(70, 5);

    const resultado = analisarHabitos(atual, anterior);

    expect(resultado).toBeNull();
  });
});
