import { describe, expect, it } from "vitest";

import {
  calcularPenalidadeRepeticao,
  selecionarMelhorInsight,
} from "../engine";

describe("IA Local V1 - Engine", () => {
  const candidatoEstudo = {
    tipo: "estudo" as const,
    mensagem: "Você estudou bastante esta semana.",
    pontuacao: 80,
    evidencias: [
      {
        metrica: "Minutos de estudo",
        valorAtual: 180,
        valorAnterior: 120,
        diferencaPercentual: 50,
        diasAnalisados: 7,
      },
    ],
  };

  const candidatoSono = {
    tipo: "sono" as const,
    mensagem: "Seu sono melhorou esta semana.",
    pontuacao: 70,
    evidencias: [
      {
        metrica: "Minutos de sono",
        valorAtual: 480,
        valorAnterior: 420,
        diferencaPercentual: 14,
        diasAnalisados: 7,
      },
    ],
  };

  describe("Seleção de Insights", () => {
    it("deve retornar null quando não existem candidatos", () => {
      const resultado = selecionarMelhorInsight([]);

      expect(resultado).toBeNull();
    });

    it("deve retornar um Insight quando existe apenas um candidato", () => {
      const resultado = selecionarMelhorInsight([candidatoEstudo]);

      expect(resultado).not.toBeNull();
      expect(resultado?.tipo).toBe("estudo");
    });

    it("deve selecionar o candidato com maior pontuação", () => {
      const resultado = selecionarMelhorInsight([
        candidatoEstudo,
        candidatoSono,
      ]);

      expect(resultado).not.toBeNull();
      expect(resultado?.tipo).toBe("estudo");
    });
  });

  describe("Controle de repetição", () => {
    it("deve evitar repetir o mesmo tipo consecutivamente", () => {
      const resultado = selecionarMelhorInsight(
        [
          {
            ...candidatoEstudo,
            pontuacao: 70,
          },
          candidatoSono,
        ],
        ["estudo"],
        {
          estudo: "2026-09-15",
        },
      );

      expect(resultado).not.toBeNull();
      expect(resultado?.tipo).toBe("sono");
    });

    it("deve aumentar a penalidade conforme o tipo se repete", () => {
      const umaRepeticao = calcularPenalidadeRepeticao(
        "estudo",
        ["estudo"],
        0,
        70,
      );

      const tresRepeticoes = calcularPenalidadeRepeticao(
        "estudo",
        ["estudo", "estudo", "estudo"],
        0,
        70,
      );

      expect(tresRepeticoes).toBeGreaterThan(umaRepeticao);
    });

    it("deve reduzir a penalidade quando a evidência é muito forte", () => {
      const penalidadeNormal = calcularPenalidadeRepeticao(
        "estudo",
        ["estudo"],
        0,
        70,
      );

      const penalidadeForte = calcularPenalidadeRepeticao(
        "estudo",
        ["estudo"],
        0,
        100,
      );

      expect(penalidadeForte).toBeLessThan(penalidadeNormal);
    });

    it("não deve aplicar penalidade para um tipo que não apareceu recentemente", () => {
      const penalidade = calcularPenalidadeRepeticao("sono", ["estudo"], 0, 70);

      expect(penalidade).toBe(0);
    });
  });

  describe("Histórico", () => {
    it("deve permitir que um tipo antigo volte a ser competitivo", () => {
      const resultado = selecionarMelhorInsight(
        [
          {
            ...candidatoEstudo,
            pontuacao: 70,
          },
          candidatoSono,
        ],
        ["estudo"],
        {
          estudo: "2026-08-20",
        },
      );

      expect(resultado).not.toBeNull();
    });
  });
});
