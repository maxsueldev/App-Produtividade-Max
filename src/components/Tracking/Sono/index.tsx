import { criarStyles } from "@/app/registrar/styles";
import { useTheme } from "@/context/ThemeContext";
import { formatarHorario } from "@/functions/data";
import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import type { Dispatch, SetStateAction } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface NapForm {
  id?: number;
  sleepTime: string;
  wakeTime: string;
}

interface SonoProps {
  sleepTime: string;
  setSleepTime: Dispatch<SetStateAction<string>>;

  wakeTime: string;
  setWakeTime: Dispatch<SetStateAction<string>>;

  naps: NapForm[];
  setNaps: Dispatch<SetStateAction<NapForm[]>>;
}

const Sono = ({
  sleepTime,
  setSleepTime,
  wakeTime,
  setWakeTime,
  naps,
  setNaps,
}: SonoProps) => {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  function adicionarSoneca() {
    setNaps((sonecas) => [
      ...sonecas,
      {
        sleepTime: "",
        wakeTime: "",
      },
    ]);
  }

  function removerSoneca(index: number) {
    setNaps((sonecas) => sonecas.filter((_, i) => i !== index));
  }

  function atualizarSoneca(
    index: number,
    campo: "sleepTime" | "wakeTime",
    valor: string,
  ) {
    setNaps((sonecas) =>
      sonecas.map((soneca, i) =>
        i === index
          ? {
              ...soneca,
              [campo]: formatarHorario(valor),
            }
          : soneca,
      ),
    );
  }

  function calcularDuracao(sleepTime: string, wakeTime: string) {
    if (!sleepTime || !wakeTime) {
      return "";
    }

    const [horaInicio, minutoInicio] = sleepTime.split(":").map(Number);
    const [horaFim, minutoFim] = wakeTime.split(":").map(Number);

    if (
      Number.isNaN(horaInicio) ||
      Number.isNaN(minutoInicio) ||
      Number.isNaN(horaFim) ||
      Number.isNaN(minutoFim)
    ) {
      return "";
    }

    const inicio = horaInicio * 60 + minutoInicio;
    const fim = horaFim * 60 + minutoFim;

    let duracao = fim - inicio;

    if (duracao < 0) {
      duracao += 24 * 60;
    }

    const horas = Math.floor(duracao / 60);
    const minutos = duracao % 60;

    if (horas === 0) {
      return `${minutos} min`;
    }

    if (minutos === 0) {
      return `${horas}h`;
    }

    return `${horas}h ${minutos}min`;
  }

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>😴 Sono</Text>

      {/* SONO PRINCIPAL */}

      <View>
        <Text style={globalStyles.label}>Horário que dormiu</Text>

        <TextInput
          style={globalStyles.input}
          value={sleepTime}
          onChangeText={(value) => {
            setSleepTime(formatarHorario(value));
          }}
          keyboardType="numeric"
          maxLength={5}
          placeholder="HH:MM"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <View>
        <Text style={globalStyles.label}>Horário que acordou</Text>

        <TextInput
          style={globalStyles.input}
          value={wakeTime}
          onChangeText={(value) => {
            setWakeTime(formatarHorario(value));
          }}
          keyboardType="numeric"
          maxLength={5}
          placeholder="HH:MM"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      {/* SONECAS */}

      <View style={{ marginTop: 20 }}>
        <Text style={globalStyles.cardTitle}>💤 Sonecas</Text>

        {naps.map((nap, index) => (
          <View
            key={nap.id ?? `nap-${index}`}
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 10,
              backgroundColor: modoEscuro ? "#292929" : "#F5F5F5",
            }}
          >
            <Text style={globalStyles.label}>Soneca {index + 1}</Text>

            <Text style={globalStyles.label}>Horário que dormiu</Text>

            <TextInput
              style={globalStyles.input}
              value={nap.sleepTime}
              onChangeText={(value) =>
                atualizarSoneca(index, "sleepTime", value)
              }
              keyboardType="numeric"
              maxLength={5}
              placeholder="HH:MM"
              placeholderTextColor={colors.placeholder}
            />

            <Text style={globalStyles.label}>Horário que acordou</Text>

            <TextInput
              style={globalStyles.input}
              value={nap.wakeTime}
              onChangeText={(value) =>
                atualizarSoneca(index, "wakeTime", value)
              }
              keyboardType="numeric"
              maxLength={5}
              placeholder="HH:MM"
              placeholderTextColor={colors.placeholder}
            />

            {nap.sleepTime && nap.wakeTime && (
              <Text
                style={{
                  marginTop: 4,
                  marginBottom: 8,
                  color: colors.secondaryText,
                }}
              >
                Duração: {calcularDuracao(nap.sleepTime, nap.wakeTime)}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => removerSoneca(index)}
              style={{
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: colors.deleteConfigText, fontWeight: "600" }}
              >
                🗑️ Remover soneca
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          onPress={adicionarSoneca}
          style={{
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: modoEscuro ? "#555555" : "#CCCCCC",
          }}
        >
          <Text
            style={{
              color: colors.cardTitle,
              fontWeight: "600",
            }}
          >
            + Adicionar soneca
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Sono;
