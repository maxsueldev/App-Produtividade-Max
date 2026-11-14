import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { initializeDatabase } from "@/database/database";
import { getDaysSummary, type DaySummary } from "@/database/days";
import {
  getStudySubjectSummaryByDays,
  type StudySubjectSummary,
} from "@/database/studies";
import {
  buscarConfiguracoes,
  type Configuracoes,
} from "@/functions/configuracoes";
import { formatarData, formatarMinutos } from "@/functions/data";

import BottomNavigation from "@/components/Utils/BottomNavigation";
import Cabecalho from "@/components/Utils/Cabecalho";
import ScreenContainer from "@/components/Utils/ScreenContainer";

import createGlobalStyles from "@/styles/globalStyles";
import { criarStyles } from "./styles";

export default function Historico() {
  const router = useRouter();
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);

  const [days, setDays] = useState<DaySummary[]>([]);
  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(
    null,
  );

  const [estudosPorDia, setEstudosPorDia] = useState<
    Record<number, StudySubjectSummary[]>
  >({});

  const [carregando, setCarregando] = useState(true);
  const ITENS_POR_PAGINA = 7;

  const [paginaAtual, setPaginaAtual] = useState(1);

  async function carregarHistorico() {
    try {
      setCarregando(true);

      const db = await initializeDatabase();

      const [registros, config] = await Promise.all([
        getDaysSummary(db),
        buscarConfiguracoes(db),
      ]);

      setDays(registros);
      setPaginaAtual(1);
      setConfiguracoes(config);

      const dayIds = registros.map((dia) => dia.id);

      if (dayIds.length > 0) {
        const estudos = await getStudySubjectSummaryByDays(db, dayIds);

        const agrupados: Record<number, StudySubjectSummary[]> = {};

        for (const estudo of estudos) {
          if (!agrupados[estudo.day_id]) {
            agrupados[estudo.day_id] = [];
          }

          agrupados[estudo.day_id].push(estudo);
        }

        setEstudosPorDia(agrupados);
      } else {
        setEstudosPorDia({});
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarHistorico();
    }, []),
  );

  /**
   * Calcula porcentagens de metas em que:
   * quanto maior o valor, melhor.
   */
  function calcularPorcentagem(valor: number, meta: number): number {
    if (meta <= 0) {
      return 0;
    }

    return Math.round((valor / meta) * 100);
  }

  /**
   * Calcula a porcentagem específica para cigarros.
   *
   * Aqui a meta representa o MÁXIMO de cigarros permitido.
   */
  function calcularPorcentagemCigarros(valor: number, meta: number): number {
    if (meta <= 0) {
      return 0;
    }

    if (valor <= meta) {
      return 100;
    }

    return Math.max(0, Math.round((meta / valor) * 100));
  }

  function calcularDesempenhoDia(item: DaySummary): number {
    if (!configuracoes) {
      return 0;
    }

    const desempenhos: number[] = [];

    if (configuracoes.acompanharSono) {
      const metaSonoMinutos = configuracoes.metaSono * 60;

      const sono =
        item.sleep_minutes !== null
          ? Math.min(
              calcularPorcentagem(item.sleep_minutes, metaSonoMinutos),
              100,
            )
          : 0;

      desempenhos.push(sono);
    }

    if (configuracoes.acompanharEstudos) {
      const estudos =
        item.study_minutes !== null
          ? Math.min(
              calcularPorcentagem(item.study_minutes, configuracoes.metaEstudo),
              100,
            )
          : 0;

      desempenhos.push(estudos);
    }

    if (configuracoes.acompanharAgua) {
      const agua =
        item.water_ml !== null && item.water_ml > 0
          ? Math.min(
              calcularPorcentagem(item.water_ml, configuracoes.metaAgua),
              100,
            )
          : 0;

      desempenhos.push(agua);
    }

    if (configuracoes.acompanharLeitura) {
      const leitura =
        item.pages_read !== null
          ? Math.min(
              calcularPorcentagem(item.pages_read, configuracoes.metaLeitura),
              100,
            )
          : 0;

      desempenhos.push(leitura);
    }

    if (configuracoes.acompanharCigarros) {
      const cigarros =
        item.cigarettes !== null && item.cigarettes > 0
          ? calcularPorcentagemCigarros(
              item.cigarettes,
              configuracoes.metaCigarros,
            )
          : 0;

      desempenhos.push(cigarros);
    }

    if (configuracoes.acompanharHabitos) {
      const habitos =
        item.habits_total === 0
          ? 100
          : Math.min(
              Math.round((item.habits_completed / item.habits_total) * 100),
              100,
            );

      desempenhos.push(habitos);
    }

    if (desempenhos.length === 0) {
      return 0;
    }

    return Math.round(
      desempenhos.reduce((total, valor) => total + valor, 0) /
        desempenhos.length,
    );
  }

  const totalPaginas = Math.ceil(days.length / ITENS_POR_PAGINA);

  const diasExibidos = useMemo(() => {
    if (days.length <= 7) {
      return days;
    }

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;

    return days.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [days, paginaAtual]);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Cabecalho title="📅 Histórico" subtitle="" />

        {carregando || !configuracoes ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator
              size="large"
              color={modoEscuro ? "#FFFFFF" : "#000000"}
            />

            <Text style={globalStyles.emptyText}>Carregando registros...</Text>
          </View>
        ) : days.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={globalStyles.emptyText}>
              Nenhum dia registrado ainda.
            </Text>
          </View>
        ) : (
          <FlatList
            data={diasExibidos}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const estudos = estudosPorDia[item.id] ?? [];

              return (
                <TouchableOpacity
                  style={[globalStyles.cardContainer, styles.card]}
                  onPress={() => router.push(`/historico/${item.id}`)}
                >
                  <Text style={styles.date}>{formatarData(item.date)}</Text>

                  <View style={styles.separator} />

                  <View style={styles.desempenho}>
                    <View style={globalStyles.header}>
                      <Text style={styles.desempenhoLabel}>
                        Desempenho do dia
                      </Text>

                      <Text style={styles.desempenhoPorcentagem}>
                        {calcularDesempenhoDia(item)}%
                      </Text>
                    </View>

                    <View style={styles.desempenhoBarra}>
                      <View
                        style={[
                          styles.desempenhoProgresso,
                          {
                            width: `${calcularDesempenhoDia(item)}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {(configuracoes.acompanharSono ||
                    configuracoes.acompanharAgua) && (
                    <View style={styles.summaryRow}>
                      {configuracoes.acompanharSono && (
                        <View style={styles.summaryItem}>
                          <Text style={styles.icon}>😴</Text>

                          <View>
                            <Text style={styles.label}>Sono</Text>

                            <Text style={styles.value}>
                              {formatarMinutos(item.sleep_minutes)}
                            </Text>

                            {item.naps_minutes > 0 && (
                              <Text style={styles.details}>
                                + {formatarMinutos(item.naps_minutes)} de soneca
                              </Text>
                            )}

                            <Text style={styles.details}>
                              {item.sleep_minutes !== null
                                ? `${calcularPorcentagem(
                                    item.sleep_minutes,
                                    configuracoes.metaSono * 60,
                                  )}% da meta`
                                : "0% da meta"}
                            </Text>
                          </View>
                        </View>
                      )}

                      {configuracoes.acompanharAgua && (
                        <View style={styles.summaryItem}>
                          <Text style={styles.icon}>💧</Text>

                          <View>
                            <Text style={styles.label}>Água</Text>

                            <Text style={styles.value}>
                              {((item.water_ml ?? 0) / 1000)
                                .toFixed(1)
                                .replace(".", ",")}
                              L
                            </Text>

                            <Text style={styles.details}>
                              {calcularPorcentagem(
                                item.water_ml ?? 0,
                                configuracoes.metaAgua,
                              )}
                              % da meta
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  {(configuracoes.acompanharEstudos ||
                    configuracoes.acompanharLeitura) && (
                    <View style={styles.summaryRow}>
                      {configuracoes.acompanharEstudos && (
                        <View style={styles.summaryItem}>
                          <Text style={styles.icon}>📚</Text>

                          <View style={styles.studyContent}>
                            <Text style={styles.label}>Estudos</Text>

                            <Text style={styles.value}>
                              {formatarMinutos(item.study_minutes)}
                            </Text>

                            <Text style={styles.details}>
                              {item.study_minutes !== null
                                ? `${calcularPorcentagem(
                                    item.study_minutes,
                                    configuracoes.metaEstudo,
                                  )}% da meta`
                                : "0% da meta"}
                            </Text>

                            {estudos.length > 0 && (
                              <Text style={styles.studySubjectName}>
                                {estudos
                                  .map((estudo) => estudo.subject)
                                  .join(", ")}
                              </Text>
                            )}
                          </View>
                        </View>
                      )}

                      {configuracoes.acompanharLeitura && (
                        <View style={styles.summaryItem}>
                          <Text style={styles.icon}>📖</Text>

                          <View>
                            <Text style={styles.label}>Leitura</Text>

                            <Text style={styles.value}>
                              {item.pages_read ?? 0} páginas
                            </Text>

                            <Text style={styles.details}>
                              {calcularPorcentagem(
                                item.pages_read ?? 0,
                                configuracoes.metaLeitura,
                              )}
                              % da meta
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Cigarros em uma linha separada */}
                  {configuracoes.acompanharCigarros && (
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryItem}>
                        <Text style={styles.icon}>🚬</Text>

                        <View>
                          <Text style={styles.label}>Cigarros</Text>

                          <Text style={styles.value}>
                            {item.cigarettes ?? 0} cigarros
                          </Text>

                          <Text style={styles.details}>
                            {calcularPorcentagemCigarros(
                              item.cigarettes ?? 0,
                              configuracoes.metaCigarros,
                            )}
                            % da meta
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}

        {days.length > 7 && (
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                paginaAtual === 1 && styles.paginationButtonDisabled,
              ]}
              onPress={() =>
                setPaginaAtual((pagina) => Math.max(pagina - 1, 1))
              }
              disabled={paginaAtual === 1}
            >
              <Text style={globalStyles.pagination}>← Voltar</Text>
            </TouchableOpacity>

            <Text style={globalStyles.pagination}>
              Página {paginaAtual} de {totalPaginas}
            </Text>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                paginaAtual === totalPaginas && styles.paginationButtonDisabled,
              ]}
              onPress={() =>
                setPaginaAtual((pagina) => Math.min(pagina + 1, totalPaginas))
              }
              disabled={paginaAtual === totalPaginas}
            >
              <Text style={globalStyles.pagination}>Avançar →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <BottomNavigation />
    </ScreenContainer>
  );
}
