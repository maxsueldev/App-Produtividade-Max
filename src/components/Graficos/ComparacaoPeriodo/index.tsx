import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import type { PeriodoAnteriorData } from "@/database/graficos";

import { criarStyles } from "./styles";

interface ComparacaoPeriodoProps {
  periodo: 7 | 30 | 90;
  periodoAnterior: PeriodoAnteriorData;

  estudoAtual: number;
  cigarrosAtual: number;
  aguaAtual: number;
  sonoAtual: number;
  humorAtual: number;
  energiaAtual: number;
  habitosAtual: number;
  leituraAtual: number;

  mostrarEstudos: boolean;
  mostrarCigarros: boolean;
  mostrarAgua: boolean;
  mostrarSono: boolean;
  mostrarHumor: boolean;
  mostrarEnergia: boolean;
  mostrarHabitos: boolean;
  mostrarLeitura: boolean;
}

function calcularVariacao(atual: number, anterior: number): number {
  if (anterior === 0) {
    return atual > 0 ? 100 : 0;
  }

  return ((atual - anterior) / anterior) * 100;
}

function formatarVariacao(valor: number): string {
  const arredondado = Math.round(Math.abs(valor));

  if (arredondado === 0) {
    return "0%";
  }

  return `${arredondado}%`;
}

function formatarPeriodo(periodo: 7 | 30 | 90): string {
  return `${periodo} dias`;
}

interface IndicadorProps {
  icone: string;
  titulo: string;
  atual: number;
  anterior: number;
  unidade?: string;
  inverso?: boolean;
}

function Indicador({
  icone,
  titulo,
  atual,
  anterior,
  unidade = "",
  inverso = false,
}: IndicadorProps) {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);

  const variacao = calcularVariacao(atual, anterior);

  const subiu = variacao > 0;
  const caiu = variacao < 0;

  const melhorou = inverso ? caiu : subiu;

  let simbolo = "→";

  if (subiu) {
    simbolo = "↑";
  } else if (caiu) {
    simbolo = "↓";
  }

  const valorVariacao = formatarVariacao(variacao);

  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.icon}>{icone}</Text>

        <Text style={styles.itemTitle}>{titulo}</Text>
      </View>

      <View style={styles.values}>
        <View>
          <Text style={styles.label}>Atual</Text>

          <Text style={styles.value}>
            {atual.toFixed(1).replace(".", ",")}
            {unidade}
          </Text>
        </View>

        <View style={styles.arrowContainer}>
          <Text
            style={[
              styles.variation,
              melhorou ? styles.variationPositive : styles.variationNegative,
            ]}
          >
            {simbolo} {valorVariacao}
          </Text>
        </View>

        <View style={styles.previous}>
          <Text style={styles.label}>Anterior</Text>

          <Text style={styles.previousValue}>
            {anterior.toFixed(1).replace(".", ",")}
            {unidade}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function ComparacaoPeriodo({
  periodo,
  periodoAnterior,
  estudoAtual,
  cigarrosAtual,
  aguaAtual,
  sonoAtual,
  humorAtual,
  energiaAtual,
  habitosAtual,
  leituraAtual,
  mostrarEstudos,
  mostrarCigarros,
  mostrarAgua,
  mostrarSono,
  mostrarHumor,
  mostrarEnergia,
  mostrarHabitos,
  mostrarLeitura,
}: ComparacaoPeriodoProps) {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        {formatarPeriodo(periodo)} atuais × {formatarPeriodo(periodo)}
        anteriores
      </Text>
      {mostrarSono && (
        <Indicador
          icone="😴"
          titulo="Sono"
          atual={sonoAtual}
          anterior={periodoAnterior.sono}
          unidade=" min"
        />
      )}
      {mostrarHabitos && (
        <Indicador
          icone="✅"
          titulo="Hábitos"
          atual={habitosAtual}
          anterior={periodoAnterior.habitos}
          unidade="%"
        />
      )}
      {mostrarEstudos && (
        <Indicador
          icone="📚"
          titulo="Estudos"
          atual={estudoAtual}
          anterior={periodoAnterior.estudo}
          unidade=" min"
        />
      )}
      {mostrarLeitura && (
        <Indicador
          icone="📖"
          titulo="Leitura"
          atual={leituraAtual}
          anterior={periodoAnterior.leitura}
          unidade=" páginas"
        />
      )}
      {mostrarAgua && (
        <Indicador
          icone="💧"
          titulo="Água"
          atual={aguaAtual}
          anterior={periodoAnterior.agua}
          unidade=" ml"
        />
      )}
      {mostrarCigarros && (
        <Indicador
          icone="🚬"
          titulo="Cigarros"
          atual={cigarrosAtual}
          anterior={periodoAnterior.cigarros}
        />
      )}
      {mostrarHumor && (
        <Indicador
          icone="😊"
          titulo="Humor"
          atual={humorAtual}
          anterior={periodoAnterior.humor}
          inverso={false}
        />
      )}
      {mostrarEnergia && (
        <Indicador
          icone="⚡"
          titulo="Energia"
          atual={energiaAtual}
          anterior={periodoAnterior.energia}
          inverso={false}
        />
      )}
    </View>
  );
}
