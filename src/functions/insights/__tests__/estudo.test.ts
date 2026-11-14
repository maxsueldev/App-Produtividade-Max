import { describe, expect, it } from "vitest";
import { analisarEstudo } from "../estudo";
describe("IA Local V1 - Analisador de Estudos", () => {
  const META_ESTUDO = 180;
  function criarMetricas(estudoMinutos: number, diasComEstudo: number) {
    return {
      diasRegistrados: 7,
      estudoMinutos,
      diasComEstudo,
      sonoMedia: null,
      diasComSono: 0,
      aguaMedia: null,
      diasComAgua: 0,
      cigarrosMedia: null,
      diasComCigarros: 0,
      habitosConcluidos: 0,
      habitosPossiveis: 0,
      taxaHabitos: null,
    };
  }
  it("deve retornar null quando não houve estudo", () => {
    const atual = criarMetricas(0, 0);
    const anterior = criarMetricas(300, 5);
    const resultado = analisarEstudo(atual, anterior, META_ESTUDO);
    expect(resultado).toBeNull();
  });
  it("deve gerar Insight quando a média de estudos aumenta mais de 15%", () => {
    const atual = criarMetricas(600, 5);
    const anterior = criarMetricas(400, 5);
    const resultado = analisarEstudo(atual, anterior, META_ESTUDO);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("estudo");
    expect(resultado?.mensagem).toContain("aumentou");
    expect(resultado?.evidencias[0].diferencaPercentual).toBe(50);
  });
  it("deve gerar Insight quando a média de estudos cai mais de 15%", () => {
    const atual = criarMetricas(300, 5);
    const anterior = criarMetricas(500, 5);
    const resultado = analisarEstudo(atual, anterior, META_ESTUDO);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("estudo");
    expect(resultado?.mensagem).toContain("caiu");
    expect(resultado?.evidencias[0].diferencaPercentual).toBe(-40);
  });
  it("não deve gerar Insight de aumento quando a mudança é exatamente 15%", () => {
    const atual = criarMetricas(460, 4);
    const anterior = criarMetricas(400, 4);
    const resultado = analisarEstudo(atual, anterior, META_ESTUDO);
    expect(resultado).toBeNull();
  });
  it("deve gerar Insight quando atinge a meta semanal", () => {
    const metaSemanal = META_ESTUDO * 7;
    const atual = criarMetricas(metaSemanal, 4);
    const anterior = criarMetricas(metaSemanal, 4);
    const resultado = analisarEstudo(atual, anterior, META_ESTUDO);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("estudo");
    expect(resultado?.pontuacao).toBe(75);
    expect(resultado?.mensagem).toContain("atingiu sua meta semanal");
  });
  it("deve gerar Insight quando estudou em pelo menos 5 dias", () => {
    const atual = criarMetricas(500, 5);
    const anterior = criarMetricas(500, 5);
    const resultado = analisarEstudo(atual, anterior, META_ESTUDO);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("estudo");
    expect(resultado?.mensagem).toContain("rotina consistente");
  });
  it("deve retornar null quando não atende nenhum critério", () => {
    const atual = criarMetricas(100, 3);
    const anterior = criarMetricas(100, 3);
    const resultado = analisarEstudo(atual, anterior, META_ESTUDO);
    expect(resultado).toBeNull();
  });
});
