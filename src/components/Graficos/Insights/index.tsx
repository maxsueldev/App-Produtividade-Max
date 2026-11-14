import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { initializeDatabase } from "@/database/database";
import { getInsightRecords, type InsightRecord } from "@/database/insights";

import createGlobalStyles from "@/styles/globalStyles";
import { criarStyles } from "./styles";

const insightInfo = {
  estudo: {
    icone: "📚",
    titulo: "Estudos",
  },
  sono: {
    icone: "😴",
    titulo: "Sono",
  },
  agua: {
    icone: "💧",
    titulo: "Água",
  },
  habitos: {
    icone: "✅",
    titulo: "Hábitos",
  },
  cigarros: {
    icone: "🚬",
    titulo: "Cigarros",
  },
};

type FiltroInsight =
  | "todos"
  | "estudo"
  | "sono"
  | "agua"
  | "habitos"
  | "cigarros";

const filtros: {
  valor: FiltroInsight;
  label: string;
}[] = [
  {
    valor: "todos",
    label: "Todos",
  },
  {
    valor: "estudo",
    label: "📚",
  },
  {
    valor: "sono",
    label: "😴",
  },
  {
    valor: "agua",
    label: "💧",
  },
  {
    valor: "habitos",
    label: "✅",
  },
  {
    valor: "cigarros",
    label: "🚬",
  },
];

export default function Insights() {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);

  const [insights, setInsights] = useState<InsightRecord[]>([]);
  const [filtro, setFiltro] = useState<FiltroInsight>("todos");

  const carregarInsights = useCallback(async () => {
    try {
      const db = await initializeDatabase();

      const resultado = await getInsightRecords(db);

      setInsights(resultado);
    } catch (error) {
      console.error("Erro ao carregar insights:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarInsights();
    }, [carregarInsights]),
  );

  const insightsFiltrados = useMemo(() => {
    if (filtro === "todos") {
      return insights;
    }

    return insights.filter((insight) => insight.type === filtro);
  }, [insights, filtro]);

  const quantidadePorTipo = useMemo(() => {
    return {
      estudo: insights.filter((insight) => insight.type === "estudo").length,

      sono: insights.filter((insight) => insight.type === "sono").length,

      agua: insights.filter((insight) => insight.type === "agua").length,

      habitos: insights.filter((insight) => insight.type === "habitos").length,

      cigarros: insights.filter((insight) => insight.type === "cigarros")
        .length,
    };
  }, [insights]);

  if (insights.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyIcon}>💡</Text>
        </View>

        <Text style={styles.emptyTitle}>Ainda não temos insights</Text>

        <Text style={[globalStyles.emptyText, { maxWidth: 330 }]}>
          Continue registrando seus dias para que o aplicativo possa encontrar
          padrões na sua rotina.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* CABEÇALHO */}

      <View style={globalStyles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>💡</Text>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Seus Insights</Text>

          <Text style={styles.subtitle}>
            Padrões e tendências encontrados na sua rotina.
          </Text>
        </View>
      </View>

      {/* RESUMO */}

      <View style={styles.summaryCard}>
        <View style={globalStyles.header}>
          <Text style={styles.summaryTitle}>📊 Resumo</Text>

          <Text style={styles.summaryTotal}>
            {insights.length} {insights.length === 1 ? "insight" : "insights"}
          </Text>
        </View>

        <View style={styles.summaryItems}>
          <ResumoItem
            icone="📚"
            quantidade={quantidadePorTipo.estudo}
            label="Estudos"
          />

          <ResumoItem
            icone="😴"
            quantidade={quantidadePorTipo.sono}
            label="Sono"
          />

          <ResumoItem
            icone="💧"
            quantidade={quantidadePorTipo.agua}
            label="Água"
          />

          <ResumoItem
            icone="✅"
            quantidade={quantidadePorTipo.habitos}
            label="Hábitos"
          />

          <ResumoItem
            icone="🚬"
            quantidade={quantidadePorTipo.cigarros}
            label="Cigarros"
          />
        </View>
      </View>

      {/* FILTROS */}

      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filtrar por categoria</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {filtros.map((item) => {
            const selecionado = filtro === item.valor;

            return (
              <TouchableOpacity
                key={item.valor}
                style={[
                  styles.filterButton,
                  selecionado && styles.filterButtonActive,
                ]}
                onPress={() => setFiltro(item.valor)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selecionado && styles.filterButtonTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* TIMELINE */}

      <View style={styles.timeline}>
        {insightsFiltrados.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>🔎</Text>

            <Text style={styles.noResultsTitle}>Nenhum insight encontrado</Text>

            <Text style={styles.noResultsText}>
              Ainda não existem insights nessa categoria.
            </Text>
          </View>
        ) : (
          insightsFiltrados.map((insight, index) => (
            <InsightTimelineItem
              key={insight.id}
              insight={insight}
              ultimo={index === insightsFiltrados.length - 1}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

interface ResumoItemProps {
  icone: string;
  quantidade: number;
  label: string;
}

function ResumoItem({ icone, quantidade, label }: ResumoItemProps) {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);

  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryIcon}>{icone}</Text>

      <Text style={styles.summaryNumber}>{quantidade}</Text>

      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

interface InsightTimelineItemProps {
  insight: InsightRecord;
  ultimo: boolean;
}

function InsightTimelineItem({ insight, ultimo }: InsightTimelineItemProps) {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);

  const info = insightInfo[insight.type as keyof typeof insightInfo];

  return (
    <View style={styles.timelineItem}>
      {/* LINHA DA TIMELINE */}

      <View style={styles.timelineMarkerColumn}>
        <View style={styles.timelineDot}>
          <Text style={styles.timelineDotText}>{info?.icone ?? "💡"}</Text>
        </View>

        {!ultimo && <View style={styles.timelineLine} />}
      </View>

      {/* CONTEÚDO */}

      <View style={styles.timelineContent}>
        <View style={styles.weekHeader}>
          <Text style={styles.weekDate}>
            Semana de {formatarData(insight.week_start)}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={globalStyles.header}>
            <View style={styles.category}>
              <Text style={styles.categoryIcon}>{info?.icone ?? "💡"}</Text>

              <Text style={styles.cardTitle}>{info?.titulo ?? "Insight"}</Text>
            </View>
          </View>

          <Text style={styles.message}>{insight.message}</Text>
        </View>
      </View>
    </View>
  );
}

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}
