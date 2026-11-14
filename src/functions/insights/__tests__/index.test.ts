import type { DaySummary } from "@/database/days";
import type { Configuracoes } from "@/functions/configuracoes";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { gerarInsight } from "../../insights";
import { analisarAgua } from "../agua";
import { analisarCigarros } from "../cigarros";
import { analisarCorrelacoes } from "../correlacoes";
import { selecionarMelhorInsight } from "../engine";
import { analisarEstudo } from "../estudo";
import { analisarHabitos } from "../habitos";
import { calcularMetricasSemana } from "../metricas";
import { obterPeriodosSemanais } from "../periodo";
import { analisarSono } from "../sono";
import type { InsightCandidato, MetricasSemana } from "../tipos";
vi.mock("expo-sqlite", () => ({}));
vi.mock("../periodo", () => ({ obterPeriodosSemanais: vi.fn() }));
vi.mock("../metricas", () => ({ calcularMetricasSemana: vi.fn() }));
vi.mock("../correlacoes", () => ({ analisarCorrelacoes: vi.fn() }));
vi.mock("../estudo", () => ({ analisarEstudo: vi.fn() }));
vi.mock("../sono", () => ({ analisarSono: vi.fn() }));
vi.mock("../agua", () => ({ analisarAgua: vi.fn() }));
vi.mock("../cigarros", () => ({ analisarCigarros: vi.fn() }));
vi.mock("../habitos", () => ({ analisarHabitos: vi.fn() }));
vi.mock("../engine", () => ({ selecionarMelhorInsight: vi.fn() }));
describe("IA Local V1 - Orquestrador de Insights", () => {
  const dias: DaySummary[] = [
    {
      id: 1,
      date: "2026-09-01",
      sleep_minutes: 480,
      studies_count: 1,
      study_minutes: 180,
      cigarettes: 10,
      water_ml: 2500,
      habits_completed: 5,
      habits_total: 5,
      naps_minutes: 0,
      naps_count: 0,
      pages_read: 0,
    },
  ];
  const metricas: MetricasSemana = {
    diasRegistrados: 7,
    estudoMinutos: 1260,
    diasComEstudo: 7,
    sonoMedia: 480,
    diasComSono: 7,
    aguaMedia: 2500,
    diasComAgua: 7,
    cigarrosMedia: 10,
    diasComCigarros: 7,
    habitosConcluidos: 35,
    habitosPossiveis: 35,
    taxaHabitos: 100,
  };
  const configuracoes: Configuracoes = {
    nome: "",
    sobrenome: "",

    acompanharSono: true,
    acompanharEstudos: true,
    acompanharCigarros: false,
    acompanharAgua: true,
    acompanharHumor: true,
    acompanharEnergia: true,
    acompanharHabitos: true,
    acompanharLeitura: true,

    metaCigarros: 15,
    metaSono: 8,
    metaEstudo: 180,
    metaAgua: 2500,
    metaQuestoes: 50,
    metaHabitos: 100,
    metaLeitura: 50,

    lembreteAgua: ["08:00", "10:00"],
    lembreteEstudos: ["09:00"],
    lembreteHabitos: ["08:30"],
    lembreteCigarros: ["11:00"],
    lembreteLeitura: ["20:00"],

    lembreteRegistro: "21:30",
    lembreteSono: "23:00",
    lembreteRevisao: "21:45",
    lembreteInsight: "20:00",

    modoEscuro: false,
  };
  const periodoAtual = {
    inicio: new Date("2026-09-07"),
    fim: new Date("2026-09-13"),
    dias,
  };
  const periodoAnterior = {
    inicio: new Date("2026-08-31"),
    fim: new Date("2026-09-06"),
    dias: [],
  };
  function criarCandidato(
    tipo: InsightCandidato["tipo"],
    pontuacao = 70,
  ): InsightCandidato {
    return {
      tipo,
      pontuacao,
      mensagem: `Insight de ${tipo}`,
      evidencias: [{ metrica: "Teste", valorAtual: 100, diasAnalisados: 7 }],
    };
  }
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(obterPeriodosSemanais).mockReturnValue({
      atual: periodoAtual,
      anterior: periodoAnterior,
    });
    vi.mocked(calcularMetricasSemana).mockImplementation(() => metricas);
    vi.mocked(analisarCorrelacoes).mockReturnValue(null);
    vi.mocked(analisarEstudo).mockReturnValue(null);
    vi.mocked(analisarSono).mockReturnValue(null);
    vi.mocked(analisarAgua).mockReturnValue(null);
    vi.mocked(analisarCigarros).mockReturnValue(null);
    vi.mocked(analisarHabitos).mockReturnValue(null);
    vi.mocked(selecionarMelhorInsight).mockReturnValue(null);
  });
  it("deve retornar null quando não existem dias registrados", () => {
    const resultado = gerarInsight([], configuracoes);
    expect(resultado).toBeNull();
    expect(obterPeriodosSemanais).not.toHaveBeenCalled();
    expect(calcularMetricasSemana).not.toHaveBeenCalled();
  });
  it("deve retornar null quando nenhum analisador gera candidato", () => {
    const resultado = gerarInsight(dias, configuracoes);
    expect(resultado).toBeNull();
    expect(analisarCorrelacoes).toHaveBeenCalled();
    expect(analisarEstudo).toHaveBeenCalled();
    expect(analisarSono).toHaveBeenCalled();
    expect(analisarAgua).toHaveBeenCalled();
    expect(analisarCigarros).toHaveBeenCalled();
    expect(analisarHabitos).toHaveBeenCalled();
    expect(selecionarMelhorInsight).not.toHaveBeenCalled();
  });
  it("deve retornar o Insight selecionado pelo engine", () => {
    const candidato = criarCandidato("estudo");
    vi.mocked(analisarEstudo).mockReturnValue(candidato);
    vi.mocked(selecionarMelhorInsight).mockReturnValue(candidato);
    const resultado = gerarInsight(dias, configuracoes);
    expect(resultado).not.toBeNull();
    expect(resultado?.tipo).toBe("estudo");
    expect(resultado?.mensagem).toBe("Insight de estudo");
    expect(resultado?.evidencias).toEqual(candidato.evidencias);
  });
  it("deve enviar os candidatos dos analisadores para o engine", () => {
    const estudo = criarCandidato("estudo", 80);
    const sono = criarCandidato("sono", 70);
    const agua = criarCandidato("agua", 75);
    vi.mocked(analisarEstudo).mockReturnValue(estudo);
    vi.mocked(analisarSono).mockReturnValue(sono);
    vi.mocked(analisarAgua).mockReturnValue(agua);
    vi.mocked(selecionarMelhorInsight).mockReturnValue(estudo);
    gerarInsight(dias, configuracoes);
    expect(selecionarMelhorInsight).toHaveBeenCalledTimes(1);
    const [candidatos] = vi.mocked(selecionarMelhorInsight).mock.calls[0];
    expect(candidatos).toEqual([estudo, sono, agua]);
  });
  it("deve passar os tipos de Insights recentes para o engine", () => {
    const candidato = criarCandidato("estudo");
    vi.mocked(analisarEstudo).mockReturnValue(candidato);
    vi.mocked(selecionarMelhorInsight).mockReturnValue(candidato);
    const tiposRecentes = ["sono", "agua"] as const;
    gerarInsight(dias, configuracoes, [...tiposRecentes]);
    expect(selecionarMelhorInsight).toHaveBeenCalledWith(
      [candidato],
      ["sono", "agua"],
      {},
    );
  });
  it("deve passar as últimas ocorrências para o engine", () => {
    const candidato = criarCandidato("estudo");
    vi.mocked(analisarEstudo).mockReturnValue(candidato);
    vi.mocked(selecionarMelhorInsight).mockReturnValue(candidato);
    const ultimasOcorrencias = { estudo: "2026-08-24", sono: "2026-08-31" };
    gerarInsight(dias, configuracoes, [], ultimasOcorrencias);
    expect(selecionarMelhorInsight).toHaveBeenCalledWith(
      [candidato],
      [],
      ultimasOcorrencias,
    );
  });
  it("deve chamar os analisadores usando as métricas e as metas configuradas", () => {
    gerarInsight(dias, configuracoes);
    expect(calcularMetricasSemana).toHaveBeenCalledTimes(2);
    expect(calcularMetricasSemana).toHaveBeenNthCalledWith(
      1,
      periodoAtual.dias,
    );
    expect(calcularMetricasSemana).toHaveBeenNthCalledWith(
      2,
      periodoAnterior.dias,
    );
    expect(analisarEstudo).toHaveBeenCalledWith(
      metricas,
      metricas,
      configuracoes.metaEstudo,
    );
    expect(analisarSono).toHaveBeenCalledWith(
      metricas,
      metricas,
      configuracoes.metaSono,
    );
    expect(analisarAgua).toHaveBeenCalledWith(
      metricas,
      metricas,
      configuracoes.metaAgua,
    );
    expect(analisarCigarros).toHaveBeenCalledWith(
      metricas,
      metricas,
      configuracoes.metaCigarros,
    );
    expect(analisarHabitos).toHaveBeenCalledWith(metricas, metricas);
  });
});
