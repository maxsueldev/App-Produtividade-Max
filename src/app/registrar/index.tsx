import { useTheme } from "@/context/ThemeContext";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { initializeDatabase } from "@/database/database";
import { deleteDay, getOrCreateDay } from "@/database/days";
import {
  createNapRecord,
  deleteNapRecordsByDay,
  getNapRecordsByDay,
} from "@/database/naps";
import { getRegistrarData } from "@/database/registrar";
import { createSleepRecord, deleteSleepRecordsByDay } from "@/database/sleep";
import {
  createStudySession,
  deleteStudySessionsByDay,
} from "@/database/studies";

import {
  createSmokingRecord,
  deleteSmokingRecordsByDay,
  getSmokingRecordByDay,
} from "@/database/smoking";

import {
  createHabitRecord,
  deleteHabitRecordsByDay,
} from "@/database/habitRecords";

import {
  createDailyMetrics,
  deleteDailyMetricsByDay,
} from "@/database/dailyMetrics";

import { buscarLeituraDoDia, salvarLeituraPorDia } from "@/database/reading";

import BottomNavigation from "@/components/Utils/BottomNavigation";
import ScreenContainer from "@/components/Utils/ScreenContainer";

import Agua from "@/components/Tracking/Agua";
import Cigarros from "@/components/Tracking/Cigarros";
import Energia from "@/components/Tracking/Energia";
import Estudos from "@/components/Tracking/Estudos";
import Habitos from "@/components/Tracking/Habitos";
import Humor from "@/components/Tracking/Humor";
import Sono from "@/components/Tracking/Sono";
import Cabecalho from "@/components/Utils/Cabecalho";

import type IHabitWithRecord from "@/interfaces/IHabitWithRecord";
import type IStudyForm from "@/interfaces/IStudyForm";

import { verificarLimiteCigarros } from "@/notifications/cigarroNotification";

import {
  buscarConfiguracoes,
  type Configuracoes,
} from "@/functions/configuracoes";

import {
  calcularDuracaoSono,
  horarioValido,
  obterDataAtual,
} from "@/functions/data";

import Leitura from "@/components/Tracking/Leitura";
import { criarStyles } from "./styles";

interface NapForm {
  id?: number;
  sleepTime: string;
  wakeTime: string;
}

export default function Registrar() {
  const router = useRouter();

  const { dayId } = useLocalSearchParams<{
    dayId?: string;
  }>();

  const editando = !!dayId;

  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [naps, setNaps] = useState<NapForm[]>([]);

  const [studies, setStudies] = useState<IStudyForm[]>([]);

  const [studySubject, setStudySubject] = useState("");
  const [studyMinutes, setStudyMinutes] = useState("");

  const [habits, setHabits] = useState<IHabitWithRecord[]>([]);

  const [showStudyForm, setShowStudyForm] = useState(false);
  const [questionsTotal, setQuestionsTotal] = useState("");
  const [questionsCorrect, setQuestionsCorrect] = useState("");

  const [morningCigarettes, setMorningCigarettes] = useState(0);
  const [afternoonCigarettes, setAfternoonCigarettes] = useState(0);
  const [nightCigarettes, setNightCigarettes] = useState(0);

  const [water, setWater] = useState(0);

  const [energy, setEnergy] = useState(0);
  const [mood, setMood] = useState(0);

  const [pagesRead, setPagesRead] = useState(0);

  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(
    null,
  );

  const [carregando, setCarregando] = useState(true);
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);
  const corCarregamento = modoEscuro ? "#FFFFFF" : "#171717";

  /*
   * ==========================
   * CARREGAR DADOS DO DIA
   * ==========================
   */

  const carregarDadosDoDia = useCallback(async () => {
    setCarregando(true);

    try {
      const db = await initializeDatabase();

      const config = await buscarConfiguracoes(db);
      setConfiguracoes(config);

      let data: string;
      let registroDayId: number | null = null;

      if (dayId) {
        registroDayId = Number(dayId);

        const day = await db.getFirstAsync<{
          id: number;
          date: string;
        }>(
          `
        SELECT id, date
        FROM days
        WHERE id = ?
      `,
          registroDayId,
        );

        if (!day) {
          Alert.alert("Erro", "O registro selecionado não foi encontrado.");

          router.back();
          return;
        }

        data = day.date;
      } else {
        data = obterDataAtual();

        const day = await db.getFirstAsync<{
          id: number;
        }>(
          `
        SELECT id
        FROM days
        WHERE date = ?
      `,
          data,
        );

        if (day) {
          registroDayId = day.id;
        }
      }

      const dados = await getRegistrarData(db, data);

      const leitura = await buscarLeituraDoDia(db, data);
      setPagesRead(leitura?.pages_read ?? 0);

      /*
       * ==========================
       * SONO PRINCIPAL
       * ==========================
       */

      setSleepTime(dados.sleep?.sleepTime ?? "");
      setWakeTime(dados.sleep?.wakeTime ?? "");

      /*
       * ==========================
       * SONECAS
       * ==========================
       */

      if (registroDayId !== null) {
        const registrosSonecas = await getNapRecordsByDay(db, registroDayId);

        setNaps(
          registrosSonecas.map((nap) => ({
            id: nap.id,
            sleepTime: nap.sleep_time,
            wakeTime: nap.wake_time,
          })),
        );
      } else {
        setNaps([]);
      }

      /*
       * ==========================
       * ESTUDOS
       * ==========================
       */

      setStudies(
        dados.studies.map((study) => ({
          id: study.id,
          subject: study.subject,
          duration: study.duration,
          questionsTotal: study.questionsTotal,
          questionsCorrect: study.questionsCorrect,
          questionsWrong: study.questionsWrong,
        })),
      );

      /*
       * ==========================
       * CIGARROS
       * ==========================
       */

      setMorningCigarettes(dados.smoking?.morning ?? 0);
      setAfternoonCigarettes(dados.smoking?.afternoon ?? 0);
      setNightCigarettes(dados.smoking?.night ?? 0);

      /*
       * ==========================
       * MÉTRICAS
       * ==========================
       */

      setWater(dados.metrics?.waterMl ?? 0);
      setEnergy(dados.metrics?.energy ?? 0);
      setMood(dados.metrics?.mood ?? 0);

      /*
       * ==========================
       * HÁBITOS
       * ==========================
       */

      setHabits(dados.habits);
    } catch (error) {
      console.error("Erro ao carregar dados do dia:", error);
    } finally {
      setCarregando(false);
    }
  }, [dayId, router]);

  /*
   * Carrega os dados sempre que a tela
   * de registro recebe foco.
   */

  useFocusEffect(
    useCallback(() => {
      carregarDadosDoDia();
    }, [carregarDadosDoDia]),
  );

  /*
   * ==========================
   * SALVAR REGISTRO
   * ==========================
   */

  async function salvarRegistro() {
    try {
      const db = await initializeDatabase();

      let registroDayId: number;

      // ==========================================
      // IDENTIFICA O DIA QUE SERÁ SALVO
      // ==========================================

      if (dayId) {
        registroDayId = Number(dayId);

        const day = await db.getFirstAsync<{
          id: number;
          date: string;
        }>(
          `
          SELECT id, date
          FROM days
          WHERE id = ?
        `,
          registroDayId,
        );

        if (!day) {
          Alert.alert("Erro", "O registro selecionado não foi encontrado.");
          return;
        }
      } else {
        registroDayId = await getOrCreateDay(db, obterDataAtual());
      }

      // ==========================================
      // VALIDA HORÁRIOS DO SONO PRINCIPAL
      // ==========================================

      if (sleepTime && !horarioValido(sleepTime)) {
        Alert.alert(
          "Horário inválido",
          "O horário de dormir deve estar no formato HH:MM.",
        );
        return;
      }

      if (wakeTime && !horarioValido(wakeTime)) {
        Alert.alert(
          "Horário inválido",
          "O horário de acordar deve estar no formato HH:MM.",
        );
        return;
      }

      // ==========================================
      // VALIDA SONECAS
      // ==========================================

      for (let index = 0; index < naps.length; index++) {
        const nap = naps[index];

        // Se a soneca estiver completamente vazia,
        // simplesmente não será salva.
        if (!nap.sleepTime && !nap.wakeTime) {
          continue;
        }

        // Se apenas um dos horários foi preenchido,
        // impede o salvamento incompleto.
        if (!nap.sleepTime || !nap.wakeTime) {
          Alert.alert(
            "Soneca incompleta",
            `Preencha os dois horários da soneca ${index + 1}.`,
          );
          return;
        }

        if (!horarioValido(nap.sleepTime)) {
          Alert.alert(
            "Horário inválido",
            `O horário de início da soneca ${index + 1} deve estar no formato HH:MM.`,
          );
          return;
        }

        if (!horarioValido(nap.wakeTime)) {
          Alert.alert(
            "Horário inválido",
            `O horário de fim da soneca ${index + 1} deve estar no formato HH:MM.`,
          );
          return;
        }
      }

      // ==========================================
      // SONO PRINCIPAL
      // ==========================================

      if (configuracoes?.acompanharSono) {
        await deleteSleepRecordsByDay(db, registroDayId);

        if (sleepTime && wakeTime) {
          const duration = calcularDuracaoSono(sleepTime, wakeTime);

          await createSleepRecord(db, {
            day_id: registroDayId,
            sleep_time: sleepTime,
            wake_time: wakeTime,
            duration_minutes: duration ?? undefined,
          });
        }
      }

      // ==========================================
      // SONECAS
      // ==========================================

      if (configuracoes?.acompanharSono) {
        await deleteNapRecordsByDay(db, registroDayId);

        for (const nap of naps) {
          if (!nap.sleepTime || !nap.wakeTime) {
            continue;
          }

          const duration = calcularDuracaoSono(nap.sleepTime, nap.wakeTime);

          await createNapRecord(db, {
            day_id: registroDayId,
            sleep_time: nap.sleepTime,
            wake_time: nap.wakeTime,
            duration_minutes: duration ?? undefined,
          });
        }
      }

      // ==========================================
      // ESTUDOS
      // ==========================================

      if (configuracoes?.acompanharEstudos) {
        await deleteStudySessionsByDay(db, registroDayId);

        for (const study of studies) {
          await createStudySession(db, {
            day_id: registroDayId,
            subject: study.subject,
            start_time: undefined,
            end_time: undefined,
            duration_minutes: study.duration,
            questions_total: study.questionsTotal,
            questions_correct: study.questionsCorrect,
            questions_wrong: study.questionsWrong,
          });
        }
      }

      // ==========================================
      // CIGARROS
      // ==========================================

      if (configuracoes?.acompanharCigarros) {
        const registroAnterior = await getSmokingRecordByDay(db, registroDayId);

        const totalAnterior = registroAnterior?.total ?? 0;

        await deleteSmokingRecordsByDay(db, registroDayId);

        const totalCigarettes =
          morningCigarettes + afternoonCigarettes + nightCigarettes;

        await createSmokingRecord(db, {
          day_id: registroDayId,
          morning: morningCigarettes,
          afternoon: afternoonCigarettes,
          night: nightCigarettes,
          total: totalCigarettes,
        });

        await verificarLimiteCigarros(
          totalAnterior,
          totalCigarettes,
          configuracoes.metaCigarros,
        );
      }

      // ==========================================
      // HÁBITOS
      // ==========================================

      if (configuracoes?.acompanharHabitos) {
        await deleteHabitRecordsByDay(db, registroDayId);

        for (const habit of habits) {
          await createHabitRecord(db, {
            day_id: registroDayId,
            habit_id: habit.id,
            completed: habit.completed ? 1 : 0,
            notes: undefined,
          });
        }
      }

      // ==========================================
      // MÉTRICAS
      // ==========================================

      if (
        configuracoes?.acompanharAgua ||
        configuracoes?.acompanharEnergia ||
        configuracoes?.acompanharHumor
      ) {
        const metricasAtuais = await db.getFirstAsync<{
          energy: number | null;
          mood: number | null;
          water_ml: number;
        }>(
          `
      SELECT energy, mood, water_ml
      FROM daily_metrics
      WHERE day_id = ?
    `,
          registroDayId,
        );

        await deleteDailyMetricsByDay(db, registroDayId);

        await createDailyMetrics(db, {
          day_id: registroDayId,

          energy: configuracoes.acompanharEnergia
            ? energy
            : (metricasAtuais?.energy ?? undefined),

          mood: configuracoes.acompanharHumor
            ? mood
            : (metricasAtuais?.mood ?? undefined),

          water_ml: configuracoes.acompanharAgua
            ? water
            : (metricasAtuais?.water_ml ?? 0),
        });
      }

      // ==========================================
      // LEITURA
      // ==========================================

      if (configuracoes?.acompanharLeitura) {
        await salvarLeituraPorDia(db, registroDayId, pagesRead);
      }

      // ==========================================
      // FINALIZA
      // ==========================================

      Alert.alert(
        editando ? "Registro atualizado" : "Registro salvo",
        editando
          ? "O registro foi atualizado com sucesso!"
          : "O registro de hoje foi salvo com sucesso!",
        [
          {
            text: "OK",
            onPress: () => {
              if (editando) {
                router.replace(`/historico/${registroDayId}`);
              } else {
                router.replace("/home");
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error("Erro ao salvar registro:", error);

      Alert.alert(
        "Erro ao salvar",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /*
   * ==========================
   * EXCLUIR DIA
   * ==========================
   */

  async function excluirDia() {
    if (!dayId) {
      return;
    }

    Alert.alert(
      "Excluir dia",
      "Tem certeza que deseja excluir todos os registros deste dia? Essa ação não pode ser desfeita.",
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

              await deleteDay(db, Number(dayId));

              Alert.alert(
                "Dia excluído",
                "Todos os registros do dia foram excluídos.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      router.replace("/historico");
                    },
                  },
                ],
              );
            } catch (error) {
              console.error("Erro ao excluir dia:", error);

              Alert.alert(
                "Erro ao excluir",
                error instanceof Error
                  ? error.message
                  : "Não foi possível excluir o dia.",
              );
            }
          },
        },
      ],
    );
  }

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
          <ActivityIndicator size="large" color={corCarregamento} />

          <Text
            style={{
              marginTop: 12,
              color: corCarregamento,
              opacity: 0.6,
            }}
          >
            Carregando registro...
          </Text>
        </View>

        <BottomNavigation />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Cabecalho
          title={editando ? "Editar registro" : "Registrar"}
          subtitle={
            editando ? "Atualize os dados do seu dia" : "Como foi seu dia?"
          }
        />

        {configuracoes?.acompanharSono && (
          <Sono
            sleepTime={sleepTime}
            setSleepTime={setSleepTime}
            wakeTime={wakeTime}
            setWakeTime={setWakeTime}
            naps={naps}
            setNaps={setNaps}
          />
        )}

        {configuracoes?.acompanharEstudos && (
          <Estudos
            studies={studies}
            setStudies={setStudies}
            studySubject={studySubject}
            setStudySubject={setStudySubject}
            studyMinutes={studyMinutes}
            setStudyMinutes={setStudyMinutes}
            questionsTotal={questionsTotal}
            setQuestionsTotal={setQuestionsTotal}
            questionsCorrect={questionsCorrect}
            setQuestionsCorrect={setQuestionsCorrect}
            showStudyForm={showStudyForm}
            setShowStudyForm={setShowStudyForm}
          />
        )}

        {configuracoes?.acompanharLeitura && (
          <Leitura
            pagesRead={pagesRead}
            setPagesRead={setPagesRead}
            metaLeitura={configuracoes.metaLeitura}
          />
        )}

        {configuracoes?.acompanharCigarros && (
          <Cigarros
            morningCigarettes={morningCigarettes}
            setMorningCigarettes={setMorningCigarettes}
            afternoonCigarettes={afternoonCigarettes}
            setAfternoonCigarettes={setAfternoonCigarettes}
            nightCigarettes={nightCigarettes}
            setNightCigarettes={setNightCigarettes}
          />
        )}

        {configuracoes?.acompanharAgua && (
          <Agua water={water} setWater={setWater} />
        )}

        {configuracoes?.acompanharEnergia && (
          <Energia energy={energy} setEnergy={setEnergy} />
        )}

        {configuracoes?.acompanharHumor && (
          <Humor mood={mood} setMood={setMood} />
        )}

        {configuracoes?.acompanharHabitos && (
          <Habitos habits={habits} setHabits={setHabits} />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={salvarRegistro}>
          <Text style={styles.saveButtonText}>
            {editando ? "ATUALIZAR DIA" : "SALVAR DIA"}
          </Text>
        </TouchableOpacity>

        {editando && (
          <TouchableOpacity style={styles.deleteButton} onPress={excluirDia}>
            <Text style={styles.deleteButtonText}>🗑️ EXCLUIR DIA</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <BottomNavigation />
    </ScreenContainer>
  );
}
