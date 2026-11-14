import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

import { initializeDatabase } from "@/database/database";
import { getHomeData, type HomeData } from "@/database/home";

import Cabecalho from "@/components/Utils/Cabecalho";
import ScreenContainer from "@/components/Utils/ScreenContainer";
import BottomNavigation from "../../components/Utils/BottomNavigation";

import HabitCard from "../../components/Home/HabitCard";
import SleepCard from "../../components/Home/SleepCard";
import SmokingCard from "../../components/Home/SmokingCard";
import StudyCard from "../../components/Home/StudyCard";
import WaterCard from "../../components/Home/WaterCard";

import ResumoDoDia from "@/components/Home/ResumoDoDia";

import {
  obterDataAtual,
  obterDataFormatada,
  obterSaudacao,
} from "@/functions/data";

import {
  buscarConfiguracoes,
  type Configuracoes,
} from "@/functions/configuracoes";

import EnergyCard from "@/components/Home/EnergyCard";
import MoodCard from "@/components/Home/MoodCard";
import ReadingCard from "@/components/Home/ReadingCard";
import { useTheme } from "@/context/ThemeContext";
import { criarStyles } from "./styles";

export default function Home() {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);

  const [dados, setDados] = useState<HomeData | null>(null);
  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(
    null,
  );

  const carregarDados = useCallback(async () => {
    try {
      const db = await initializeDatabase();

      const dataAtual = obterDataAtual();

      const [resultado, config] = await Promise.all([
        getHomeData(db, dataAtual),
        buscarConfiguracoes(db),
      ]);

      setDados(resultado);
      setConfiguracoes(config);
    } catch (error) {
      console.error("Erro ao carregar dados da Home:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados]),
  );

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Cabecalho
          title={obterSaudacao(configuracoes?.nome)}
          subtitle={obterDataFormatada()}
        />

        {dados && configuracoes && (
          <ResumoDoDia data={dados} configuracoes={configuracoes} />
        )}

        {configuracoes && (
          <>
            {configuracoes.acompanharSono && (
              <SleepCard
                durationMinutes={dados?.sleep?.duration_minutes ?? null}
                sleep_time={dados?.sleep?.sleep_time ?? null}
                wake_time={dados?.sleep?.wake_time ?? null}
                napsMinutes={dados?.sleep?.naps_minutes ?? 0}
                napsCount={dados?.sleep?.naps_count ?? 0}
                metaSono={configuracoes.metaSono}
              />
            )}

            {configuracoes.acompanharEstudos && (
              <StudyCard
                totalMinutes={dados?.studies.total_minutes ?? 0}
                subjects={dados?.studies.subjects ?? []}
                metaEstudo={configuracoes.metaEstudo}
                metaQuestoes={configuracoes.metaQuestoes}
              />
            )}

            {configuracoes.acompanharLeitura && (
              <ReadingCard
                pagesRead={dados?.reading?.pages_read ?? 0}
                metaLeitura={configuracoes.metaLeitura}
              />
            )}

            {configuracoes.acompanharCigarros && (
              <SmokingCard
                total={dados?.smoking?.total ?? 0}
                morning={dados?.smoking?.morning ?? 0}
                afternoon={dados?.smoking?.afternoon ?? 0}
                night={dados?.smoking?.night ?? 0}
                metaCigarros={configuracoes.metaCigarros}
              />
            )}

            {configuracoes.acompanharAgua && (
              <WaterCard
                waterMl={dados?.metrics?.water_ml ?? 0}
                metaAgua={configuracoes.metaAgua}
              />
            )}
          </>
        )}

        {configuracoes &&
          (configuracoes.acompanharEnergia ||
            configuracoes.acompanharHumor) && (
            <View style={styles.energyMoodContainer}>
              {configuracoes.acompanharEnergia && (
                <EnergyCard energy={dados?.metrics?.energy ?? null} />
              )}

              {configuracoes.acompanharHumor && (
                <MoodCard mood={dados?.metrics?.mood ?? null} />
              )}
            </View>
          )}

        {configuracoes?.acompanharHabitos && (
          <HabitCard
            total={dados?.habits.total ?? 0}
            completed={dados?.habits.completed ?? 0}
            habits={dados?.habits.items ?? []}
          />
        )}
      </ScrollView>

      <BottomNavigation />
    </ScreenContainer>
  );
}
