import { useTheme } from "@/context/ThemeContext";
import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import { StyleSheet, Text, View } from "react-native";

interface SleepCardProps {
  durationMinutes: number | null;
  sleep_time: string | null;
  wake_time: string | null;
  napsMinutes: number;
  napsCount: number;
  metaSono: number;
}

function formatarDuracao(minutos: number) {
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (minutosRestantes === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${minutosRestantes}min`;
}

export default function SleepCard({
  durationMinutes,
  sleep_time,
  wake_time,
  napsMinutes,
  napsCount,
  metaSono,
}: SleepCardProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  const metaSonoMinutos = metaSono * 60;

  const temSono = durationMinutes !== null;

  const porcentagem =
    temSono && metaSonoMinutos > 0
      ? Math.min((durationMinutes / metaSonoMinutos) * 100, 100)
      : 0;

  const diferenca = temSono ? Math.abs(durationMinutes - metaSonoMinutos) : 0;

  const atingiuMeta = temSono && durationMinutes >= metaSonoMinutos;

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>😴 Sono</Text>

      {!temSono ? (
        <>
          <Text style={globalStyles.emptyText}>
            Nenhum registro de sono hoje.
          </Text>

          {napsMinutes > 0 && (
            <View style={styles.napSummary}>
              <Text style={styles.napText}>
                💤 {formatarDuracao(napsMinutes)} de soneca
              </Text>
            </View>
          )}
        </>
      ) : (
        <>
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>
              {formatarDuracao(durationMinutes)}
            </Text>

            <View>
              <Text style={styles.durationLabel}>dormidas</Text>

              <Text style={globalStyles.goal}>
                meta: {formatarDuracao(metaSonoMinutos)} por noite
              </Text>
            </View>
          </View>

          {napsMinutes > 0 && (
            <View style={styles.napSummary}>
              <Text style={styles.napText}>
                💤 + {formatarDuracao(napsMinutes)} de soneca
              </Text>
            </View>
          )}

          <View style={globalStyles.progressBackground}>
            <View
              style={[
                globalStyles.progress,
                {
                  backgroundColor: colors.sleepColor,
                  width: `${porcentagem}%`,
                },
              ]}
            />
          </View>

          <Text style={globalStyles.percentage}>
            {Math.round(porcentagem)}% da meta
          </Text>

          <Text
            style={[
              styles.status,
              {
                color: atingiuMeta
                  ? colors.statusSuccess
                  : colors.statusWarning,
              },
            ]}
          >
            {atingiuMeta
              ? `✓ ${formatarDuracao(diferenca)} acima da meta`
              : `⚠ Faltam ${formatarDuracao(diferenca)} para a meta`}
          </Text>

          <View style={styles.times}>
            <View style={styles.time}>
              <Text style={styles.timeLabel}>Dormiu</Text>
              <Text style={styles.timeValue}>{sleep_time}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.time}>
              <Text style={styles.timeLabel}>Acordou</Text>
              <Text style={styles.timeValue}>{wake_time}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    napSummary: {
      backgroundColor: colors.cardBgItem,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 10,
      marginBottom: 14,
    },

    napText: {
      fontSize: 13,
      color: colors.subtitle,
      fontWeight: "600",
    },

    durationContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 14,
    },

    duration: {
      fontSize: 42,
      fontWeight: "700",
      color: colors.text,
    },

    durationLabel: {
      fontSize: 14,
      color: colors.subtitle,
    },

    status: {
      fontSize: 13,
      fontWeight: "600",
      marginTop: 12,
      marginBottom: 18,
    },

    divider: {
      width: 1,
      height: 32,
      backgroundColor: colors.divider,
    },

    times: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    time: {
      flex: 1,
      alignItems: "center",
    },

    timeLabel: {
      fontSize: 12,
      color: colors.subtitle,
      marginBottom: 4,
    },

    timeValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
  });
};
