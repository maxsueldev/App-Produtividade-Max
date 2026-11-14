import { describe, expect, it } from "vitest";
import { analisarSono } from "../sono";
describe("IA Local V1 - Analisador de Sono", () => {
  const META_SONO = 8;
  function criarMetricas(sonoMedia: number | null, diasComSono: number) {
    return {
      diasRegistrados: 7,
      estudoMinutos: 0,
      diasComEstudo: 0,
      sonoMedia,
      diasComSono,
      aguaMedia: null,
      diasComAgua: 0,
      cigarrosMedia: null,
      diasComCigarros: 0,
      habitosConcluidos: 0,
      habitosPossiveis: 0,
      taxaHabitos: null,
    };
  }
  it("deve retornar null quando não existe média de sono", () => {
    const atual = criarMetricas(null, 0);
    const anterior = criarMetricas(450, 7);
    const resultado = analisarSono(atual, anterior, META_SONO);
    expect(resultado).toBeNull();
  });
  it("deve gerar Insight quando a média de sono aumenta mais de 30 minutos", () => {
    const atual = criarMetricas(480, 7);
    const anterior = criarMetricas(420, 7);
    const resultado = analisarSono(atual, anterior, META_SONO);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("sono");
    expect(resultado?.mensagem).toContain("aumentou");
    expect(resultado?.evidencias[0].valorAtual).toBe(480);
    expect(resultado?.evidencias[0].valorAnterior).toBe(420);
  });
  it("deve gerar Insight quando a média de sono cai mais de 30 minutos", () => {
    const atual = criarMetricas(360, 7);
    const anterior = criarMetricas(420, 7);
    const resultado = analisarSono(atual, anterior, META_SONO);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("sono");
    expect(resultado?.mensagem).toContain("caiu");
    expect(resultado?.evidencias[0].valorAtual).toBe(360);
    expect(resultado?.evidencias[0].valorAnterior).toBe(420);
  });
  it("não deve gerar Insight de aumento com exatamente 30 minutos", () => {
    const atual = criarMetricas(450, 5);
    const anterior = criarMetricas(420, 5);
    const resultado = analisarSono(atual, anterior, META_SONO);
    expect(resultado).toBeNull();
  });
  it("não deve gerar Insight de queda com exatamente 30 minutos", () => {
    const atual = criarMetricas(390, 5);
    const anterior = criarMetricas(420, 5);
    const resultado = analisarSono(atual, anterior, META_SONO);
    expect(resultado).toBeNull();
  });
  it("deve gerar Insight quando atinge a meta de sono", () => {
    const atual = criarMetricas(480, 4);
    const anterior = criarMetricas(480, 4);
    const resultado = analisarSono(atual, anterior, META_SONO);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("sono");
    expect(resultado?.pontuacao).toBe(75);
    expect(resultado?.mensagem).toContain("atingindo sua meta");
  });
  it("deve gerar Insight quando registrou sono em pelo menos 6 dias", () => {
    const atual = criarMetricas(400, 6);
    const anterior = criarMetricas(400, 6);
    const resultado = analisarSono(atual, anterior, META_SONO);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("sono");
    expect(resultado?.pontuacao).toBe(70);
    expect(resultado?.mensagem).toContain("boa regularidade");
  });
  it("deve retornar null quando nenhum critério for atingido", () => {
    const atual = criarMetricas(400, 5);
    const anterior = criarMetricas(400, 5);
    const resultado = analisarSono(atual, anterior, META_SONO);
    expect(resultado).toBeNull();
  });
});
