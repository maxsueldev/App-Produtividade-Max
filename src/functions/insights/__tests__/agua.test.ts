import { describe, expect, it } from "vitest";

import { analisarAgua } from "../agua";

describe("IA Local V1 - Analisador de Água", () => {
  const META_AGUA = 2500;

  function criarMetricas(aguaMedia: number | null, diasComAgua: number) {
    return {
      diasRegistrados: 7,

      estudoMinutos: 0,
      diasComEstudo: 0,

      sonoMedia: null,
      diasComSono: 0,

      aguaMedia,
      diasComAgua,

      cigarrosMedia: null,
      diasComCigarros: 0,

      habitosConcluidos: 0,
      habitosPossiveis: 0,
      taxaHabitos: null,
    };
  }

  it("deve retornar null quando não existe média de água", () => {
    const atual = criarMetricas(null, 0);
    const anterior = criarMetricas(2500, 7);

    const resultado = analisarAgua(atual, anterior, META_AGUA);

    expect(resultado).toBeNull();
  });

  it("deve gerar Insight quando a média de água aumenta mais de 15%", () => {
    const atual = criarMetricas(3000, 7);
    const anterior = criarMetricas(2500, 7);

    const resultado = analisarAgua(atual, anterior, META_AGUA);

    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("agua");
    expect(resultado?.mensagem).toContain("aumentou");
    expect(resultado?.evidencias[0].valorAtual).toBe(3000);
    expect(resultado?.evidencias[0].valorAnterior).toBe(2500);
    expect(resultado?.evidencias[0].diferencaPercentual).toBe(20);
  });

  it("deve gerar Insight quando a média de água cai mais de 15%", () => {
    const atual = criarMetricas(2000, 7);
    const anterior = criarMetricas(2500, 7);

    const resultado = analisarAgua(atual, anterior, META_AGUA);

    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("agua");
    expect(resultado?.mensagem).toContain("caiu");
    expect(resultado?.evidencias[0].valorAtual).toBe(2000);
    expect(resultado?.evidencias[0].valorAnterior).toBe(2500);
    expect(resultado?.evidencias[0].diferencaPercentual).toBe(-20);
  });

  it("não deve gerar Insight de aumento com exatamente 15%", () => {
    const atual = criarMetricas(2300, 5);
    const anterior = criarMetricas(2000, 5);

    const resultado = analisarAgua(atual, anterior, META_AGUA);

    expect(resultado).toBeNull();
  });

  it("não deve gerar Insight de queda com exatamente 15%", () => {
    const atual = criarMetricas(1700, 5);
    const anterior = criarMetricas(2000, 5);

    const resultado = analisarAgua(atual, anterior, META_AGUA);

    expect(resultado).toBeNull();
  });

  it("deve gerar Insight quando atinge a meta de água", () => {
    const atual = criarMetricas(META_AGUA, 5);
    const anterior = criarMetricas(META_AGUA, 5);

    const resultado = analisarAgua(atual, anterior, META_AGUA);

    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("agua");
    expect(resultado?.pontuacao).toBe(75);
    expect(resultado?.mensagem).toContain("atingindo sua meta");
    expect(resultado?.evidencias[0].valorAtual).toBe(META_AGUA);
  });

  it("deve gerar Insight quando registrou água em pelo menos 6 dias", () => {
    const atual = criarMetricas(2000, 6);
    const anterior = criarMetricas(2000, 6);

    const resultado = analisarAgua(atual, anterior, META_AGUA);

    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("agua");
    expect(resultado?.pontuacao).toBe(70);
    expect(resultado?.mensagem).toContain("6 dos 7 dias");
  });

  it("deve retornar null quando nenhum critério for atingido", () => {
    const atual = criarMetricas(2000, 5);
    const anterior = criarMetricas(2000, 5);

    const resultado = analisarAgua(atual, anterior, META_AGUA);

    expect(resultado).toBeNull();
  });
});
