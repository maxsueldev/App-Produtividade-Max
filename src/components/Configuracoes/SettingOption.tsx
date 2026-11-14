import { useTheme } from "@/context/ThemeContext";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface SettingOptionProps {
  icon: ReactNode;
  title: string;
  description: string;
  rightContent?: ReactNode;
}

export default function SettingOption({
  icon,
  title,
  description,
  rightContent,
}: SettingOptionProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);

  return (
    <View style={styles.option}>
      <View style={styles.optionIcon}>{icon}</View>

      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>

        <Text style={styles.optionDescription}>{description}</Text>
      </View>

      {rightContent}
    </View>
  );
}

function criarStyles(modoEscuro: boolean) {
  const cores = {
    text: modoEscuro ? "#FFFFFF" : "#171717",
    secondaryText: modoEscuro ? "#BDBDBD" : "#525252",
    iconBackground: modoEscuro ? "#2A2A2A" : "#E9E9E9",
  };

  return StyleSheet.create({
    option: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 56,
      gap: 12,
      paddingVertical: 12,
    },

    optionIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: cores.iconBackground,
    },

    optionContent: {
      flex: 1,
    },

    optionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: cores.text,
    },

    optionDescription: {
      fontSize: 13,
      color: cores.secondaryText,
      marginTop: 3,
    },
  });
}
