import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";

import { getDailyDetails, type DailyDetails } from "@/database/dailyDetails";
import { initializeDatabase } from "@/database/database";
import { deleteDay } from "@/database/days";

import BottomNavigation from "@/components/Utils/BottomNavigation";
import Cabecalho from "@/components/Utils/Cabecalho";
import ScreenContainer from "@/components/Utils/ScreenContainer";

import { formatarData, formatarMinutos } from "@/functions/data";

import { buscarConfiguracoes, Configuracoes } from "@/functions/configuracoes";
import createGlobalStyles from "@/styles/globalStyles";
import { criarStyles } from "./styles";

export default function DetalhesHistorico() {
  const router = useRouter();

  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const stylesReg = criarStylesReg(modoEscuro);

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [details, setDetails] = useState<DailyDetails | null>(null);
  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(
    null,
  );

  async function carregarDetalhes() {
    try {
      const db = await initializeDatabase();

      const [resultado, config] = await Promise.all([
        getDailyDetails(db, Number(id)),
        buscarConfiguracoes(db),
      ]);

      setDetails(resultado);
      setConfiguracoes(config);
    } catch (error) {
      console.error("Erro ao carregar detalhes do dia:", error);
    }
  }

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  if (!details || !configuracoes) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  async function excluirRegistro() {
    if (!id) {
      return;
    }

    Alert.alert(
      "Excluir registro",
      "Tem certeza que deseja excluir este dia? Essa ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const db = await initializeDatabase();

              await deleteDay(db, Number(id));

              router.back();
            } catch (error) {
              console.error("Erro ao excluir registro:", error);
              Alert.alert("Erro", "Não foi possível excluir o registro.");
            }
          },
        },
      ],
    );
  }

  function obterSaudacao(nome: string): string {
    throw new Error("Function not implemented.");
  }

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}
        <View style={globalStyles.headerContainer}>
          <View style={globalStyles.header}>
            <View style={stylesReg.headerContent}>
              <Cabecalho
                title="📅 Detalhes"
                subtitle={formatarData(details.date)}
              />
            </View>

            <TouchableOpacity
              style={stylesReg.editButton}
              onPress={() => router.push(`/registrar?dayId=${details.id}`)}
            >
              <Text style={stylesReg.editButtonText}>✏️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SONO */}
        {configuracoes.acompanharSono && (
          <View style={globalStyles.cardContainer}>
            <Text style={globalStyles.cardTitle}>😴 Sono</Text>

            {details.sleep ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>🛏️ Dormiu</Text>

                  <Text style={styles.infoValue}>
                    {details.sleep.sleep_time}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>☀️ Acordou</Text>

                  <Text style={styles.infoValue}>
                    {details.sleep.wake_time}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>⏱️ Duração</Text>

                  <Text style={styles.infoValue}>
                    {formatarMinutos(details.sleep.duration_minutes)}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={globalStyles.emptyText}>
                Nenhum registro de sono.
              </Text>
            )}

            {details.naps.length > 0 && (
              <>
                <View style={styles.separator} />

                <Text
                  style={{
                    color: modoEscuro ? "#FFFFFF" : "#222222",
                    fontSize: 16,
                    fontWeight: "700",
                    marginBottom: 12,
                    marginTop: 4,
                  }}
                >
                  💤 Sonecas
                </Text>

                {details.naps.map((nap, index) => (
                  <View key={nap.id} style={{ marginBottom: 12 }}>
                    <Text
                      style={{
                        color: modoEscuro ? "#FFFFFF" : "#222222",
                        fontSize: 14,
                        fontWeight: "600",
                        marginBottom: 6,
                      }}
                    >
                      Soneca {index + 1}
                    </Text>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>🛏️ Dormiu</Text>

                      <Text style={styles.infoValue}>{nap.sleep_time}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>☀️ Acordou</Text>

                      <Text style={styles.infoValue}>{nap.wake_time}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>⏱️ Duração</Text>

                      <Text style={styles.infoValue}>
                        {formatarMinutos(nap.duration_minutes)}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* ESTUDOS */}
        {configuracoes.acompanharEstudos && (
          <View style={globalStyles.cardContainer}>
            <Text style={globalStyles.cardTitle}>📚 Estudos</Text>

            {details.studies.length === 0 ? (
              <Text style={globalStyles.emptyText}>
                Nenhum estudo registrado.
              </Text>
            ) : (
              details.studies.map((study) => (
                <View key={study.id} style={styles.studyContainer}>
                  <Text style={styles.studySubject}>{study.subject}</Text>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>⏱️ Tempo</Text>

                    <Text style={styles.infoValue}>
                      {formatarMinutos(study.duration_minutes)}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>📝 Questões</Text>

                    <Text style={styles.infoValue}>
                      {study.questions_correct}/{study.questions_total}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>❌ Erros</Text>

                    <Text style={styles.infoValue}>
                      {study.questions_wrong}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* LEITURA */}
        {configuracoes.acompanharLeitura && (
          <View style={globalStyles.cardContainer}>
            <Text style={globalStyles.cardTitle}>📖 Leitura</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📚 Páginas lidas</Text>

              <Text style={styles.infoValue}>
                {details.pages_read ?? 0} / {configuracoes.metaLeitura}
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📊 Progresso</Text>

              <Text style={styles.infoValue}>
                {configuracoes.metaLeitura > 0
                  ? Math.min(
                      Math.round(
                        ((details.pages_read ?? 0) /
                          configuracoes.metaLeitura) *
                          100,
                      ),
                      100,
                    )
                  : 0}
                %
              </Text>
            </View>
          </View>
        )}

        {/* CIGARROS */}
        {configuracoes.acompanharCigarros && (
          <View style={globalStyles.cardContainer}>
            <Text style={globalStyles.cardTitle}>🚬 Cigarros</Text>

            {details.smoking ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>🌅 Manhã</Text>

                  <Text style={styles.infoValue}>
                    {details.smoking.morning}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>☀️ Tarde</Text>

                  <Text style={styles.infoValue}>
                    {details.smoking.afternoon}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>🌙 Noite</Text>

                  <Text style={styles.infoValue}>{details.smoking.night}</Text>
                </View>

                <View style={styles.totalBox}>
                  <Text style={styles.totalLabel}>Total</Text>

                  <Text style={styles.totalValue}>{details.smoking.total}</Text>
                </View>
              </>
            ) : (
              <Text style={globalStyles.emptyText}>Nenhum registro.</Text>
            )}
          </View>
        )}

        {/* MÉTRICAS */}
        {(configuracoes.acompanharAgua ||
          configuracoes.acompanharEnergia ||
          configuracoes.acompanharHumor) && (
          <View style={globalStyles.cardContainer}>
            <Text style={globalStyles.cardTitle}>📊 Métricas</Text>

            {details.metrics ? (
              <>
                {configuracoes.acompanharAgua && (
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>💧 Água</Text>

                    <Text style={styles.metricValue}>
                      {details.metrics.water_ml} ml
                    </Text>
                  </View>
                )}

                {configuracoes.acompanharEnergia && (
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>⚡ Energia</Text>

                    <Text style={styles.metricValue}>
                      {details.metrics.energy ?? "Não informado"}/5
                    </Text>
                  </View>
                )}

                {configuracoes.acompanharHumor && (
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>😊 Humor</Text>

                    <Text style={styles.metricValue}>
                      {details.metrics.mood ?? "Não informado"}/5
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={globalStyles.emptyText}>
                Nenhuma métrica registrada.
              </Text>
            )}
          </View>
        )}

        {/* HÁBITOS */}
        {configuracoes.acompanharHabitos && (
          <View style={globalStyles.cardContainer}>
            <Text style={globalStyles.cardTitle}>✅ Hábitos</Text>

            {details.habits.length === 0 ? (
              <Text style={globalStyles.emptyText}>
                Nenhum hábito registrado.
              </Text>
            ) : (
              details.habits.map((habit) => (
                <View key={habit.id} style={styles.habitRow}>
                  <Text style={styles.habitIcon}>
                    {habit.completed === 1 ? "☑️" : "⬜"}
                  </Text>

                  <Text style={styles.habitName}>{habit.name}</Text>
                </View>
              ))
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.excluirButton}
          onPress={excluirRegistro}
        >
          <Text style={styles.excluirButtonText}>🗑️ Excluir registro</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation />
    </ScreenContainer>
  );
}

function criarStylesReg(modoEscuro: boolean) {
  return StyleSheet.create({
    headerContent: {
      flex: 1,
    },

    editButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: modoEscuro ? "#2A2A2A" : "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      elevation: 4,
    },

    editButtonText: {
      fontSize: 21,
    },
  });
}
