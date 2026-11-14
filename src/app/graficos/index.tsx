import { useTheme } from "@/context/ThemeContext";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { initializeDatabase } from "@/database/database";
import {
  getComparacaoPeriodo,
  getHabitChartData,
  getMoodEnergyChartData,
  getReadingChartData,
  getSleepChartData,
  getSmokingChartData,
  getStudyChartData,
  getWaterChartData,
  HabitChartData,
  type MoodEnergyChartData,
  type PeriodoAnteriorData,
  type ReadingChartData,
  type SleepChartData,
  type SmokingChartData,
  type StudyChartData,
  type WaterChartData,
} from "@/database/graficos";

import PeriodoBotao from "@/components/Graficos/PeriodoBotao";
import BottomNavigation from "@/components/Utils/BottomNavigation";
import Cabecalho from "@/components/Utils/Cabecalho";
import ExpandableCard from "@/components/Utils/ExpandableCard";
import ScreenContainer from "@/components/Utils/ScreenContainer";

import ComparacaoPeriodo from "@/components/Graficos/ComparacaoPeriodo";
import DestaquesPeriodo from "@/components/Graficos/DestaquesPeriodo";
import ResumoGeral from "@/components/Graficos/ResumoGeral";

import AguaChart from "@/components/Graficos/AguaChart";
import CigarrosChart from "@/components/Graficos/CigarrosChart";
import EstudosChart from "@/components/Graficos/EstudosChart";
import HabitosChart from "@/components/Graficos/HabitosChart";
import HumorEnergiaChart from "@/components/Graficos/HumorEnergiaChart";
import SonoChart from "@/components/Graficos/SonoChart";

import AguaSummary from "@/components/Graficos/AguaSummary";
import CigarrosSummary from "@/components/Graficos/CigarrosSummary";
import EstudosSummary from "@/components/Graficos/EstudosSummary";
import HabitosSummary from "@/components/Graficos/HabitosSummary";
import HumorEnergiaSummary from "@/components/Graficos/HumorEnergiaSummary";
import SonoSummary from "@/components/Graficos/SonoSummary";

import {
  calcularHabitosConcluidos,
  calcularMediaDiaria,
  calcularPercentual,
  calcularTotalHabitos,
} from "@/functions/graficos";

import {
  buscarConfiguracoes,
  type Configuracoes,
} from "@/functions/configuracoes";

import Insights from "@/components/Graficos/Insights";

import LeituraChart from "@/components/Graficos/LeituraChart";
import LeituraSummary from "@/components/Graficos/LeituraSummary";
import createGlobalStyles from "@/styles/globalStyles";
import { criarStyles } from "./styles";

type Periodo = 7 | 30 | 90;

export default function Graficos() {
  const [studyData, setStudyData] = useState<StudyChartData[]>([]);
  const [smokingData, setSmokingData] = useState<SmokingChartData[]>([]);
  const [waterData, setWaterData] = useState<WaterChartData[]>([]);
  const [sleepData, setSleepData] = useState<SleepChartData[]>([]);
  const [moodEnergyData, setMoodEnergyData] = useState<MoodEnergyChartData[]>(
    [],
  );
  const [habitData, setHabitData] = useState<HabitChartData[]>([]);

  const [readingData, setReadingData] = useState<ReadingChartData[]>([]);

  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(
    null,
  );

  const [periodo, setPeriodo] = useState<Periodo>(7);

  const [periodoAnterior, setPeriodoAnterior] = useState<PeriodoAnteriorData>({
    estudo: 0,
    cigarros: 0,
    agua: 0,
    sono: 0,
    humor: 0,
    energia: 0,
    habitos: 0,
    leitura: 0,
  });

  const [mostrarInsights, setMostrarInsights] = useState(false);

  const [carregando, setCarregando] = useState(true);

  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);

  const carregarDados = useCallback(async () => {
    setCarregando(true);

    try {
      const db = await initializeDatabase();

      const resultadoEstudos = await getStudyChartData(db, periodo);
      const resultadoCigarros = await getSmokingChartData(db, periodo);
      const resultadoAgua = await getWaterChartData(db, periodo);
      const resultadoSono = await getSleepChartData(db, periodo);
      const resultadoMoodEnergy = await getMoodEnergyChartData(db, periodo);
      const resultadoLeitura = await getReadingChartData(db, periodo);
      const habitos = await getHabitChartData(db, periodo);
      const comparacao = await getComparacaoPeriodo(db, periodo);
      const config = await buscarConfiguracoes(db);

      const dataAtual = obterDataAtual();
      const dataInicial = calcularDataInicial(dataAtual, periodo);

      const leitura = await db.getAllAsync<ReadingChartData>(
        `
        SELECT
          days.date,
          reading_records.pages_read
        FROM reading_records
        INNER JOIN days
          ON days.id = reading_records.day_id
        WHERE days.date >= ?
          AND days.date <= ?
        ORDER BY days.date ASC
      `,
        dataInicial,
        dataAtual,
      );

      setHabitData(habitos);
      setMoodEnergyData(resultadoMoodEnergy);
      setSleepData(resultadoSono);
      setStudyData(resultadoEstudos);
      setSmokingData(resultadoCigarros);
      setWaterData(resultadoAgua);
      setReadingData(resultadoLeitura);
      setPeriodoAnterior(comparacao);
      setConfiguracoes(config);
    } catch (error) {
      console.error("Erro ao carregar dados dos gráficos:", error);
    } finally {
      setCarregando(false);
    }
  }, [periodo]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados]),
  );

  function alterarPeriodo(novoPeriodo: Periodo) {
    setPeriodo(novoPeriodo);
  }

  /*
   * -----------------------------------------------------------
   * Variáveis usadas na comparação de períodos
   * -----------------------------------------------------------
   */

  const estudoAtual = calcularMediaDiaria(
    studyData.map((item) => item.total_minutes),
    periodo,
  );

  const cigarrosAtual = calcularMediaDiaria(
    smokingData.map((item) => item.total),
    periodo,
  );

  const aguaAtual = calcularMediaDiaria(
    waterData.map((item) => item.water_ml),
    periodo,
  );

  const sonoAtual = calcularMediaDiaria(
    sleepData.map((item) => item.duration_minutes),
    periodo,
  );

  const humorAtual = calcularMediaDiaria(
    moodEnergyData.map((item) => item.mood),
    periodo,
  );

  const energiaAtual = calcularMediaDiaria(
    moodEnergyData.map((item) => item.energy),
    periodo,
  );

  const totalHabitos = calcularTotalHabitos(habitData);

  const habitosConcluidos = calcularHabitosConcluidos(habitData);

  const habitosAtual = calcularPercentual(habitosConcluidos, totalHabitos);

  const leituraMediaAtual = calcularMediaDiaria(
    readingData.map((item) => item.pages_read),
    periodo,
  );

  const diasNaMetaLeitura =
    configuracoes?.metaLeitura && configuracoes.metaLeitura > 0
      ? readingData.filter(
          (item) => item.pages_read >= configuracoes.metaLeitura,
        ).length
      : 0;

  if (carregando) {
    return (
      <ScreenContainer>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator
            size="large"
            color={modoEscuro ? "#FFFFFF" : "#171717"}
          />

          <Text
            style={{
              marginTop: 12,
              color: modoEscuro ? "#FFFFFF" : "#171717",
              opacity: 0.6,
            }}
          >
            Carregando gráficos...
          </Text>
        </View>

        <BottomNavigation />
      </ScreenContainer>
    );
  }

  if (!configuracoes) {
    return null;
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.headerContainer}>
          <Cabecalho title="📊 Evolução" subtitle="Acompanhe sua evolução" />

          <TouchableOpacity
            style={styles.insightsButton}
            onPress={() => setMostrarInsights((valor) => !valor)}
          >
            <Text style={styles.insightsButtonText}>
              {mostrarInsights ? "📊 Resumos" : "💡 Insights"}
            </Text>
          </TouchableOpacity>

          {!mostrarInsights && (
            <View style={styles.periodContainer}>
              <PeriodoBotao
                value={7}
                periodo={periodo}
                setPeriodo={setPeriodo}
                setMostrarInsights={setMostrarInsights}
              />

              <PeriodoBotao
                value={30}
                periodo={periodo}
                setPeriodo={setPeriodo}
                setMostrarInsights={setMostrarInsights}
              />

              <PeriodoBotao
                value={90}
                periodo={periodo}
                setPeriodo={setPeriodo}
                setMostrarInsights={setMostrarInsights}
              />
            </View>
          )}

          {mostrarInsights ? (
            <Insights />
          ) : (
            <>
              {/* =================================================
                  RESUMO GERAL
                  ================================================= */}

              <ExpandableCard title="📈 Resumo do período" defaultOpen={true}>
                <ResumoGeral
                  studyData={configuracoes.acompanharEstudos ? studyData : []}
                  smokingData={
                    configuracoes.acompanharCigarros ? smokingData : []
                  }
                  waterData={configuracoes.acompanharAgua ? waterData : []}
                  sleepData={configuracoes.acompanharSono ? sleepData : []}
                  moodEnergyData={moodEnergyData}
                  habitData={configuracoes.acompanharHabitos ? habitData : []}
                  readingData={
                    configuracoes.acompanharLeitura ? readingData : []
                  }
                  periodo={periodo}
                  metaEstudo={configuracoes.metaEstudo}
                  metaCigarros={configuracoes.metaCigarros}
                  metaAgua={configuracoes.metaAgua}
                  metaSono={configuracoes.metaSono}
                  metaLeitura={configuracoes.metaLeitura}
                  mostrarEstudos={configuracoes.acompanharEstudos}
                  mostrarCigarros={configuracoes.acompanharCigarros}
                  mostrarAgua={configuracoes.acompanharAgua}
                  mostrarSono={configuracoes.acompanharSono}
                  mostrarHumor={configuracoes.acompanharHumor}
                  mostrarEnergia={configuracoes.acompanharEnergia}
                  mostrarHabitos={configuracoes.acompanharHabitos}
                  mostrarLeitura={configuracoes.acompanharLeitura}
                />
              </ExpandableCard>

              {/* =================================================
                  COMPARAÇÃO DE PERÍODOS
                  ================================================= */}

              <ExpandableCard title="📊 Comparação de períodos">
                <ComparacaoPeriodo
                  periodo={periodo}
                  periodoAnterior={periodoAnterior}
                  estudoAtual={
                    configuracoes.acompanharEstudos ? estudoAtual : 0
                  }
                  cigarrosAtual={
                    configuracoes.acompanharCigarros ? cigarrosAtual : 0
                  }
                  aguaAtual={configuracoes.acompanharAgua ? aguaAtual : 0}
                  sonoAtual={configuracoes.acompanharSono ? sonoAtual : 0}
                  humorAtual={configuracoes.acompanharHumor ? humorAtual : 0}
                  energiaAtual={
                    configuracoes.acompanharEnergia ? energiaAtual : 0
                  }
                  habitosAtual={
                    configuracoes.acompanharHabitos ? habitosAtual : 0
                  }
                  leituraAtual={
                    configuracoes.acompanharLeitura ? leituraMediaAtual : 0
                  }
                  mostrarEstudos={configuracoes.acompanharEstudos}
                  mostrarCigarros={configuracoes.acompanharCigarros}
                  mostrarAgua={configuracoes.acompanharAgua}
                  mostrarSono={configuracoes.acompanharSono}
                  mostrarHumor={configuracoes.acompanharHumor}
                  mostrarEnergia={configuracoes.acompanharEnergia}
                  mostrarHabitos={configuracoes.acompanharHabitos}
                  mostrarLeitura={configuracoes.acompanharLeitura}
                />
              </ExpandableCard>

              {/* =================================================
                  DESTAQUES
                  ================================================= */}

              <ExpandableCard title="🏆 Destaques do período">
                <DestaquesPeriodo
                  studyData={studyData}
                  smokingData={smokingData}
                  waterData={waterData}
                  sleepData={sleepData}
                  moodEnergyData={moodEnergyData}
                  readingData={
                    configuracoes.acompanharLeitura ? readingData : []
                  }
                  mostrarEstudos={configuracoes.acompanharEstudos}
                  mostrarCigarros={configuracoes.acompanharCigarros}
                  mostrarAgua={configuracoes.acompanharAgua}
                  mostrarSono={configuracoes.acompanharSono}
                  mostrarHumor={configuracoes.acompanharHumor}
                  mostrarEnergia={configuracoes.acompanharEnergia}
                  mostrarLeitura={configuracoes.acompanharLeitura}
                />
              </ExpandableCard>

              {/* =================================================
                  SONO
                  ================================================= */}

              {configuracoes.acompanharSono && (
                <ExpandableCard title="😴 Sono por dia">
                  {sleepData.length === 0 ? (
                    <Text style={globalStyles.emptyText}>
                      Nenhum registro de sono no período.
                    </Text>
                  ) : (
                    <>
                      <SonoSummary
                        data={sleepData}
                        periodo={periodo}
                        metaSono={configuracoes.metaSono}
                      />

                      <SonoChart
                        data={sleepData}
                        periodo={periodo}
                        metaSono={configuracoes.metaSono}
                      />
                    </>
                  )}
                </ExpandableCard>
              )}

              {/* =================================================
                  ESTUDOS
                  ================================================= */}

              {configuracoes.acompanharEstudos && (
                <ExpandableCard title="📚 Estudos">
                  {studyData.length === 0 ? (
                    <Text style={globalStyles.emptyText}>
                      Nenhum estudo registrado no período.
                    </Text>
                  ) : (
                    <>
                      <EstudosSummary
                        data={studyData}
                        periodo={periodo}
                        metaEstudo={configuracoes.metaEstudo}
                      />

                      <EstudosChart
                        data={studyData}
                        periodo={periodo}
                        metaEstudo={configuracoes.metaEstudo}
                      />
                    </>
                  )}
                </ExpandableCard>
              )}

              {/* =================================================
                  LEITURA
                  ================================================= */}
              {configuracoes.acompanharLeitura && (
                <ExpandableCard title="📖 Leitura por dia">
                  {readingData.length === 0 ? (
                    <Text style={globalStyles.emptyText}>
                      Nenhuma leitura registrada no período.
                    </Text>
                  ) : (
                    <>
                      <LeituraSummary
                        data={readingData}
                        periodo={periodo}
                        metaLeitura={configuracoes.metaLeitura}
                      />

                      <LeituraChart
                        data={readingData}
                        periodo={periodo}
                        metaLeitura={configuracoes.metaLeitura}
                      />
                    </>
                  )}
                </ExpandableCard>
              )}

              {/* =================================================
                  ÁGUA
                  ================================================= */}

              {configuracoes.acompanharAgua && (
                <ExpandableCard title="💧 Água por dia">
                  {waterData.length === 0 ? (
                    <Text style={globalStyles.emptyText}>
                      Nenhum registro de água no período.
                    </Text>
                  ) : (
                    <>
                      <AguaSummary
                        data={waterData}
                        periodo={periodo}
                        metaAgua={configuracoes.metaAgua}
                      />

                      <AguaChart
                        data={waterData}
                        periodo={periodo}
                        metaAgua={configuracoes.metaAgua}
                      />
                    </>
                  )}
                </ExpandableCard>
              )}

              {/* =================================================
                  CIGARROS
                  ================================================= */}

              {configuracoes.acompanharCigarros && (
                <ExpandableCard title="🚬 Cigarros por dia">
                  {smokingData.length === 0 ? (
                    <Text style={globalStyles.emptyText}>
                      Nenhum registro de cigarros no período.
                    </Text>
                  ) : (
                    <>
                      <CigarrosSummary
                        data={smokingData}
                        periodo={periodo}
                        metaCigarros={configuracoes.metaCigarros}
                      />

                      <CigarrosChart
                        data={smokingData}
                        periodo={periodo}
                        metaCigarros={configuracoes.metaCigarros}
                      />
                    </>
                  )}
                </ExpandableCard>
              )}

              {/* =================================================
                  HUMOR / ENERGIA
                  ================================================= */}

              {(configuracoes.acompanharHumor ||
                configuracoes.acompanharEnergia) && (
                <ExpandableCard title="⚡ Energia e 😊 Humor">
                  {moodEnergyData.length === 0 ? (
                    <Text style={globalStyles.emptyText}>
                      Nenhum registro de energia ou humor no período.
                    </Text>
                  ) : (
                    <>
                      <HumorEnergiaSummary
                        data={moodEnergyData}
                        periodo={periodo}
                        mostrarHumor={configuracoes.acompanharHumor}
                        mostrarEnergia={configuracoes.acompanharEnergia}
                      />

                      <HumorEnergiaChart
                        data={moodEnergyData}
                        mostrarHumor={configuracoes.acompanharHumor}
                        mostrarEnergia={configuracoes.acompanharEnergia}
                      />
                    </>
                  )}
                </ExpandableCard>
              )}

              {/* =================================================
                  HÁBITOS
                  ================================================= */}

              {configuracoes.acompanharHabitos && (
                <ExpandableCard title="✅ Hábitos por dia">
                  {habitData.length === 0 ? (
                    <Text style={globalStyles.emptyText}>
                      Nenhum hábito registrado no período.
                    </Text>
                  ) : (
                    <>
                      <HabitosSummary data={habitData} periodo={periodo} />

                      <HabitosChart
                        data={habitData}
                        periodo={periodo}
                        metaHabitos={configuracoes.metaHabitos}
                      />
                    </>
                  )}
                </ExpandableCard>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <BottomNavigation />
    </ScreenContainer>
  );
}

function obterDataAtual(): string {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function calcularDataInicial(dataFinal: string, periodo: Periodo): string {
  const [ano, mes, dia] = dataFinal.split("-").map(Number);

  const data = new Date(ano, mes - 1, dia);

  data.setDate(data.getDate() - (periodo - 1));

  const novoAno = data.getFullYear();
  const novoMes = String(data.getMonth() + 1).padStart(2, "0");
  const novoDia = String(data.getDate()).padStart(2, "0");

  return `${novoAno}-${novoMes}-${novoDia}`;
}
