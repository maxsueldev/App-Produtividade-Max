import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import type {
  MoodEnergyChartData,
  ReadingChartData,
  SleepChartData,
  SmokingChartData,
  StudyChartData,
  WaterChartData,
} from "@/database/graficos";

import { criarStyles } from "./styles";

interface DestaquesPeriodoProps {
  studyData: StudyChartData[];
  smokingData: SmokingChartData[];
  waterData: WaterChartData[];
  sleepData: SleepChartData[];
  moodEnergyData: MoodEnergyChartData[];
  readingData: ReadingChartData[];

  mostrarEstudos: boolean;
  mostrarCigarros: boolean;
  mostrarAgua: boolean;
  mostrarSono: boolean;
  mostrarHumor: boolean;
  mostrarEnergia: boolean;
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

function formatarData(data: string): string {
  const [, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}

export default function DestaquesPeriodo({
  studyData,
  smokingData,
  waterData,
  sleepData,
  moodEnergyData,
  readingData,
  mostrarEstudos,
  mostrarCigarros,
  mostrarAgua,
  mostrarSono,
  mostrarHumor,
  mostrarEnergia,
  mostrarLeitura,
}: DestaquesPeriodoProps) {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);

  const melhorEstudo =
    studyData.length > 0
      ? studyData.reduce((maior, item) =>
          item.total_minutes > maior.total_minutes ? item : maior,
        )
      : null;

  const maiorLeitura =
    readingData.length > 0
      ? readingData.reduce((maior, item) =>
          item.pages_read > maior.pages_read ? item : maior,
        )
      : null;

  const maiorAgua =
    waterData.length > 0
      ? waterData.reduce((maior, item) =>
          item.water_ml > maior.water_ml ? item : maior,
        )
      : null;

  const maiorSono =
    sleepData.length > 0
      ? sleepData.reduce((maior, item) =>
          item.duration_minutes > maior.duration_minutes ? item : maior,
        )
      : null;

  const menorCigarro =
    smokingData.length > 0
      ? smokingData.reduce((menor, item) =>
          item.total < menor.total ? item : menor,
        )
      : null;

  const melhorHumor =
    moodEnergyData.length > 0
      ? moodEnergyData.reduce((maior, item) =>
          item.mood > maior.mood ? item : maior,
        )
      : null;

  const melhorEnergia =
    moodEnergyData.length > 0
      ? moodEnergyData.reduce((maior, item) =>
          item.energy > maior.energy ? item : maior,
        )
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {mostrarSono && maiorSono && (
          <View style={styles.item}>
            <Text style={styles.icon}>😴</Text>

            <View style={styles.info}>
              <Text style={styles.label}>Maior período de sono</Text>

              <Text style={styles.value}>
                {formatarDuracao(maiorSono.duration_minutes)}
              </Text>

              <Text style={styles.date}>{formatarData(maiorSono.date)}</Text>
            </View>
          </View>
        )}

        {mostrarEstudos && melhorEstudo && (
          <View style={styles.item}>
            <Text style={styles.icon}>📚</Text>

            <View style={styles.info}>
              <Text style={styles.label}>Melhor dia de estudos</Text>

              <Text style={styles.value}>
                {formatarDuracao(melhorEstudo.total_minutes)}
              </Text>

              <Text style={styles.date}>{formatarData(melhorEstudo.date)}</Text>
            </View>
          </View>
        )}

        {mostrarLeitura && maiorLeitura && (
          <View style={styles.item}>
            <Text style={styles.icon}>📖</Text>
            <View style={styles.info}>
              <Text style={styles.label}>Maior leitura do período</Text>
              <Text style={styles.value}>
                {maiorLeitura.pages_read}
                {maiorLeitura.pages_read === 1 ? " página" : " páginas"}
              </Text>
              <Text style={styles.date}>{formatarData(maiorLeitura.date)}</Text>
            </View>
          </View>
        )}

        {mostrarAgua && maiorAgua && (
          <View style={styles.item}>
            <Text style={styles.icon}>💧</Text>

            <View style={styles.info}>
              <Text style={styles.label}>Maior consumo de água</Text>

              <Text style={styles.value}>
                {formatarAgua(maiorAgua.water_ml)}
              </Text>

              <Text style={styles.date}>{formatarData(maiorAgua.date)}</Text>
            </View>
          </View>
        )}

        {mostrarCigarros && menorCigarro && (
          <View style={styles.item}>
            <Text style={styles.icon}>🚬</Text>

            <View style={styles.info}>
              <Text style={styles.label}>Menor quantidade de cigarros</Text>

              <Text style={styles.value}>
                {menorCigarro.total}
                {menorCigarro.total === 1 ? " cigarro" : " cigarros"}
              </Text>

              <Text style={styles.date}>{formatarData(menorCigarro.date)}</Text>
            </View>
          </View>
        )}

        {mostrarHumor && melhorHumor && (
          <View style={styles.item}>
            <Text style={styles.icon}>😊</Text>

            <View style={styles.info}>
              <Text style={styles.label}>Melhor humor</Text>

              <Text style={styles.value}>
                {melhorHumor.mood.toFixed(1).replace(".", ",")}/5
              </Text>

              <Text style={styles.date}>{formatarData(melhorHumor.date)}</Text>
            </View>
          </View>
        )}

        {mostrarEnergia && melhorEnergia && (
          <View style={styles.item}>
            <Text style={styles.icon}>⚡</Text>

            <View style={styles.info}>
              <Text style={styles.label}>Maior energia</Text>

              <Text style={styles.value}>
                {melhorEnergia.energy.toFixed(1).replace(".", ",")}
                /5
              </Text>

              <Text style={styles.date}>
                {formatarData(melhorEnergia.date)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
