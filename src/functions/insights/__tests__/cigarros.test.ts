import { describe, expect, it } from "vitest";
import { analisarCigarros } from "../cigarros";
describe("IA Local V1 - Analisador de Cigarros", () => {
  const META_CIGARROS = 15;
  function criarMetricas(
    cigarrosMedia: number | null,
    diasComCigarros: number,
  ) {
    return {
      diasRegistrados: 7,
      estudoMinutos: 0,
      diasComEstudo: 0,
      sonoMedia: null,
      diasComSono: 0,
      aguaMedia: null,
      diasComAgua: 0,
      cigarrosMedia,
      diasComCigarros,
      habitosConcluidos: 0,
      habitosPossiveis: 0,
      taxaHabitos: null,
    };
  }
  it("deve retornar null quando não existe média de cigarros", () => {
    const atual = criarMetricas(null, 0);
    const anterior = criarMetricas(15, 7);
    const resultado = analisarCigarros(atual, anterior, META_CIGARROS);
    expect(resultado).toBeNull();
  });
  it("deve gerar Insight quando a média de cigarros cai mais de 15%", () => {
    const atual = criarMetricas(10, 7);
    const anterior = criarMetricas(20, 7);
    const resultado = analisarCigarros(atual, anterior, META_CIGARROS);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("cigarros");
    expect(resultado?.mensagem).toContain("caiu");
    expect(resultado?.evidencias[0].valorAtual).toBe(10);
    expect(resultado?.evidencias[0].valorAnterior).toBe(20);
    expect(resultado?.evidencias[0].diferencaPercentual).toBe(-50);
  });
  it("deve gerar Insight quando a média de cigarros aumenta mais de 15%", () => {
    const atual = criarMetricas(20, 7);
    const anterior = criarMetricas(10, 7);
    const resultado = analisarCigarros(atual, anterior, META_CIGARROS);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("cigarros");
    expect(resultado?.mensagem).toContain("aumentou");
    expect(resultado?.evidencias[0].valorAtual).toBe(20);
    expect(resultado?.evidencias[0].valorAnterior).toBe(10);
    expect(resultado?.evidencias[0].diferencaPercentual).toBe(100);
  });
  it("não deve gerar Insight de queda com exatamente 15%", () => {
    const atual = criarMetricas(17, 5);
    const anterior = criarMetricas(20, 5);
    const resultado = analisarCigarros(atual, anterior, META_CIGARROS);
    expect(resultado).toBeNull();
  });
  it("não deve gerar Insight de aumento com exatamente 15%", () => {
    const atual = criarMetricas(23, 5);
    const anterior = criarMetricas(20, 5);
    const resultado = analisarCigarros(atual, anterior, META_CIGARROS);
    expect(resultado).toBeNull();
  });
  it("deve gerar Insight quando a média está dentro da meta", () => {
    const atual = criarMetricas(META_CIGARROS, 5);
    const anterior = criarMetricas(META_CIGARROS, 5);
    const resultado = analisarCigarros(atual, anterior, META_CIGARROS);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("cigarros");
    expect(resultado?.pontuacao).toBe(70);
    expect(resultado?.mensagem).toContain("dentro da meta");
    expect(resultado?.evidencias[0].valorAtual).toBe(META_CIGARROS);
  });
  it("deve gerar Insight quando a média está abaixo da meta", () => {
    const atual = criarMetricas(10, 5);
    const anterior = criarMetricas(10, 5);
    const resultado = analisarCigarros(atual, anterior, META_CIGARROS);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("cigarros");
    expect(resultado?.pontuacao).toBe(70);
    expect(resultado?.mensagem).toContain("dentro da meta");
  });
  it("deve retornar null quando nenhum critério for atingido", () => {
    const atual = criarMetricas(20, 5);
    const anterior = criarMetricas(20, 5);
    const resultado = analisarCigarros(atual, anterior, META_CIGARROS);
    expect(resultado).toBeNull();
  });
});
