import { useTheme } from "@/context/ThemeContext";
import type { HomeData } from "@/database/home";
import { Text, View } from "react-native";

import { type Configuracoes } from "@/functions/configuracoes";

import { formatarAgua, formatarDuracao } from "@/functions/data";
import createGlobalStyles from "@/styles/globalStyles";
import CardResumo from "./CardResumo";
import { criarStyles } from "./styles";

interface ResumoDoDiaProps {
  data: HomeData;
  configuracoes: Configuracoes;
}

export default function ResumoDoDia({ data, configuracoes }: ResumoDoDiaProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);

  return (
    <View style={[globalStyles.cardContainer]}>
      <Text style={globalStyles.cardTitle}>🔥 Seu dia</Text>

      <View style={styles.grid}>
        {configuracoes.acompanharSono && (
          <CardResumo
            icon="😴"
            value={
              data.sleep?.duration_minutes != null
                ? formatarDuracao(data.sleep.duration_minutes)
                : "Não registrado"
            }
            final="de sono"
          />
        )}

        {configuracoes.acompanharHabitos && (
          <CardResumo
            icon="✅"
            value={`${data.habits.completed}/${data.habits.total}`}
            final="hábitos concluídos"
          />
        )}

        {configuracoes.acompanharEstudos && (
          <CardResumo
            icon="📚"
            value={formatarDuracao(data.studies.total_minutes)}
            final="estudados"
          />
        )}

        {configuracoes.acompanharLeitura && (
          <CardResumo
            icon="📖"
            value={`${data.reading?.pages_read ?? 0}/${configuracoes.metaLeitura}`}
            final="páginas lidas"
          />
        )}

        {configuracoes.acompanharAgua && (
          <CardResumo
            icon="💧"
            value={formatarAgua(data.metrics?.water_ml ?? 0)}
            final="de água"
          />
        )}

        {configuracoes.acompanharCigarros && (
          <CardResumo
            icon="🚬"
            value={data.smoking?.total ?? 0}
            final="cigarros"
          />
        )}

        {configuracoes.acompanharHumor && (
          <CardResumo
            icon="😊"
            value={`${data.metrics?.mood ?? 0}/5`}
            final="humor"
          />
        )}

        {configuracoes.acompanharEnergia && (
          <CardResumo
            icon="⚡"
            value={`${data.metrics?.energy ?? 0}/5`}
            final="energia"
          />
        )}
      </View>
    </View>
  );
}
