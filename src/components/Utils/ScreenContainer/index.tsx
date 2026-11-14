import { useTheme } from "@/context/ThemeContext";
import { obterCores } from "@/styles/colors";
import { StyleSheet, View, ViewProps } from "react-native";

export default function ScreenContainer({
  children,
  style,
  ...props
}: ViewProps) {
  const { modoEscuro } = useTheme();
  const colors = obterCores(modoEscuro);

  return (
    <View
      {...props}
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundScreenContainer,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 40,
  },
});
