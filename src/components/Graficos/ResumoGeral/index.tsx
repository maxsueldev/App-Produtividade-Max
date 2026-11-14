import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import type {
  HabitChartData,
  MoodEnergyChartData,
  ReadingChartData,
  SleepChartData,
  SmokingChartData,
  StudyChartData,
  WaterChartData,
} from "@/database/graficos";

import { formatarMinutos } from "@/functions/data";
import { criarStyles } from "./styles";

interface ResumoGeralProps {
  studyData: StudyChartData[];
  smokingData: SmokingChartData[];
  waterData: WaterChartData[];
  sleepData: SleepChartData[];
  moodEnergyData: MoodEnergyChartData[];
  habitData: HabitChartData[];
  readingData: ReadingChartData[];
  periodo: 7 | 30 | 90;

  metaEstudo: number;
  metaCigarros: number;
  metaAgua: number;
  metaSono: number;
  metaLeitura: number;

  mostrarEstudos: boolean;
  mostrarCigarros: boolean;
  mostrarAgua: boolean;
  mostrarSono: boolean;
  mostrarHumor: boolean;
  mostrarEnergia: boolean;
  mostrarHabitos: boolean;
  mostrarLeitura: boolean;
}

function formatarDuracao(minutos: number): string {
  if (minutos <= 0) {
    return "0 min";
  }

  const horas = Math.floor(minutos / 60);
  const minutosRestantes = Math.round(minutos % 60);

  if (horas === 0) {
    return `${minutosRestantes} min`;
  }

  if (minutosRestantes === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${minutosRestantes}min`;
}

function formatarAgua(ml: number): string {
  return `${(ml / 1000).toFixed(1).replace(".", ",")} L`;
}

function formatarNumero(numero: number): string {
  return numero.toFixed(1).replace(".", ",");
}

function calcularProgresso(valor: number, meta: number): number {
  if (meta <= 0) {
    return 0;
  }

  return Math.min((valor / meta) * 100, 100);
}

export default function ResumoGeral({
  studyData,
  smokingData,
  waterData,
  sleepData,
  moodEnergyData,
  habitData,
  readingData,
  periodo,
  metaEstudo,
  metaCigarros,
  metaAgua,
  metaSono,
  metaLeitura,
  mostrarEstudos,
  mostrarCigarros,
  mostrarAgua,
  mostrarSono,
  mostrarHumor,
  mostrarEnergia,
  mostrarHabitos,
  mostrarLeitura,
}: ResumoGeralProps) {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);

  const metaSonoMinutos = metaSono * 60;

  const tempoEstudado = studyData.reduce(
    (total, item) => total + item.total_minutes,
    0,
  );

  const mediaEstudo = tempoEstudado / periodo;

  const mediaCigarros =
    smokingData.reduce((total, item) => total + item.total, 0) / periodo;

  const totalAgua = waterData.reduce((total, item) => total + item.water_ml, 0);

  const mediaAgua = totalAgua / periodo;

  const totalSono = sleepData.reduce(
    (total, item) => total + item.duration_minutes,
    0,
  );

  const mediaSono = totalSono / periodo;

  const mediaHumor =
    moodEnergyData.reduce((total, item) => total + item.mood, 0) / periodo;

  const mediaEnergia =
    moodEnergyData.reduce((total, item) => total + item.energy, 0) / periodo;

  const totalHabitos = habitData.reduce((total, item) => total + item.total, 0);

  const habitosConcluidos = habitData.reduce(
    (total, item) => total + item.completed,
    0,
  );

  const percentualHabitos =
    totalHabitos > 0 ? (habitosConcluidos / totalHabitos) * 100 : 0;

  const totalLeitura = readingData.reduce(
    (total, item) => total + item.pages_read,
    0,
  );
  const mediaLeitura = totalLeitura / periodo;

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* SONO */}
        {mostrarSono && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>😴</Text>
              <Text style={styles.cardTitle}>Sono</Text>
            </View>

            <Text style={styles.value}>{formatarDuracao(mediaSono)}</Text>

            <Text style={styles.description}>
              meta: {formatarDuracao(metaSonoMinutos)} por dia
            </Text>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  styles.sleepProgress,
                  {
                    width: `${calcularProgresso(mediaSono, metaSonoMinutos)}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}
        {/* HÁBITOS */}
        {mostrarHabitos && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>✅</Text>
              <Text style={styles.cardTitle}>Hábitos</Text>
            </View>

            <Text style={styles.value}>{percentualHabitos.toFixed(0)}%</Text>

            <Text style={styles.description}>conclusão no período</Text>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  styles.habitProgress,
                  {
                    width: `${percentualHabitos}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}
        {/* ESTUDOS */}
        {mostrarEstudos && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>📚</Text>
              <Text style={styles.cardTitle}>Estudos</Text>
            </View>

            <Text style={styles.value}>{formatarDuracao(mediaEstudo)}</Text>

            <Text style={styles.description}>
              meta: {formatarMinutos(metaEstudo)} por dia
            </Text>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  styles.studyProgress,
                  {
                    width: `${calcularProgresso(mediaEstudo, metaEstudo)}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}
        {/* LEITURA */}
        {mostrarLeitura && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>📖</Text>
              <Text style={styles.cardTitle}>Leitura</Text>
            </View>
            <Text style={styles.value}>
              {mediaLeitura.toFixed(1).replace(".", ",")} páginas
            </Text>
            <Text style={styles.description}>
              meta: {metaLeitura} páginas por dia
            </Text>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  styles.readingProgress,
                  { width: `${calcularProgresso(mediaLeitura, metaLeitura)}%` },
                ]}
              />
            </View>
          </View>
        )}
        {/* ÁGUA */}
        {mostrarAgua && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>💧</Text>
              <Text style={styles.cardTitle}>Água</Text>
            </View>

            <Text style={styles.value}>{formatarAgua(mediaAgua)}</Text>

            <Text style={styles.description}>
              meta: {formatarAgua(metaAgua)} por dia
            </Text>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  styles.waterProgress,
                  {
                    width: `${calcularProgresso(mediaAgua, metaAgua)}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}
        {/* CIGARROS */}
        {mostrarCigarros && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>🚬</Text>
              <Text style={styles.cardTitle}>Cigarros</Text>
            </View>

            <Text style={styles.value}>{formatarNumero(mediaCigarros)}</Text>

            <Text style={styles.description}>
              meta: até {metaCigarros} por dia
            </Text>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  styles.smokingProgress,
                  {
                    width: `${calcularProgresso(mediaCigarros, metaCigarros)}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}
        {/* HUMOR */}
        {mostrarHumor && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>😊</Text>
              <Text style={styles.cardTitle}>Humor</Text>
            </View>

            <Text style={styles.value}>{formatarNumero(mediaHumor)}/5</Text>

            <Text style={styles.description}>escala de 0 a 5</Text>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  styles.moodProgress,
                  {
                    width: `${calcularProgresso(mediaHumor, 5)}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}
        {/* ENERGIA */}
        {mostrarEnergia && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>⚡</Text>
              <Text style={styles.cardTitle}>Energia</Text>
            </View>

            <Text style={styles.value}>{formatarNumero(mediaEnergia)}/5</Text>

            <Text style={styles.description}>escala de 0 a 5</Text>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  styles.energyProgress,
                  {
                    width: `${calcularProgresso(mediaEnergia, 5)}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
