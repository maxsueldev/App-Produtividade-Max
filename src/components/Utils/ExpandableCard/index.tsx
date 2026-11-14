import { useTheme } from "@/context/ThemeContext";
import type { ReactNode } from "react";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { criarStyles } from "./styles";

interface ExpandableCardProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function ExpandableCard({
  title,
  children,
  defaultOpen = false,
}: ExpandableCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);

  function alternar() {
    setOpen((atual) => !atual);
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={alternar}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.arrow}>{open ? "▼" : "▶"}</Text>
      </TouchableOpacity>

      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
}
