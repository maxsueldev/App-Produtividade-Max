import { useTheme } from "@/context/ThemeContext";
import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import { StyleSheet, Text, View } from "react-native";

interface ReadingCardProps {
  pagesRead: number;
  metaLeitura: number;
}

export default function ReadingCard({
  pagesRead,
  metaLeitura,
}: ReadingCardProps) {
  const { modoEscuro } = useTheme();

  const percentual =
    metaLeitura > 0 ? Math.min((pagesRead / metaLeitura) * 100, 100) : 0;

  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  return (
    <View style={globalStyles.cardContainer}>
      <View style={[globalStyles.header, { marginBottom: 16 }]}>
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>📖</Text>

          <View>
            <Text style={[globalStyles.cardTitle, { marginBottom: 0 }]}>
              Leitura
            </Text>

            <Text style={styles.subtitle}>Meta: {metaLeitura} páginas</Text>
          </View>
        </View>

        <Text style={styles.pages}>
          {pagesRead}/{metaLeitura}
        </Text>
      </View>

      <View style={globalStyles.progressBackground}>
        <View
          style={[
            globalStyles.progress,
            { backgroundColor: colors.readingColor, width: `${percentual}%` },
          ]}
        />
      </View>

      <Text style={globalStyles.percentage}>
        {pagesRead >= metaLeitura
          ? "Meta diária atingida! 🎉"
          : `${Math.round(percentual)}% da meta concluída`}
      </Text>
    </View>
  );
}

function criarStyles(modoEscuro: boolean) {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    icon: {
      fontSize: 28,
    },

    subtitle: {
      fontSize: 13,
      marginTop: 2,
      color: colors.secondaryText,
    },

    pages: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
  });
}
