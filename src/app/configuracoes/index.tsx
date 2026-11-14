import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";

import SettingOption from "@/components/Configuracoes/SettingOption";
import BottomNavigation from "@/components/Utils/BottomNavigation";
import Cabecalho from "@/components/Utils/Cabecalho";
import ScreenContainer from "@/components/Utils/ScreenContainer";

import { initializeDatabase } from "@/database/database";

import {
  adicionarHorario,
  alterarHorario,
  alterarLembreteIndividual,
  buscarConfiguracoes,
  Configuracoes,
  removerHorario,
  salvarConfiguracoes,
  sincronizarNotificacoes,
  validarConfiguracoes,
} from "@/functions/configuracoes";

import { formatarHorario } from "@/functions/data";
import { exportarDadosCSV, exportarDadosJSON } from "@/functions/exportarDados";
import { importarDadosJSON } from "@/functions/importarDados";

import {
  adicionarHabito,
  alterarHabito,
  carregarHabitos,
  removerHabito,
} from "@/functions/habitos";

import { limparTodosDados } from "@/functions/limparDados";

import {
  cancelarNotificacaoInsight,
  cancelarNotificacoesFixas,
} from "@/notifications/notificationService";

import type IHabit from "@/interfaces/IHabit";

import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import { criarStyles } from "./styles";

export default function TelaConfiguracoes() {
  const { modoEscuro, alterarModoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  const [carregando, setCarregando] = useState(true);

  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(
    null,
  );

  const [salvando, setSalvando] = useState(false);

  const [habitos, setHabitos] = useState<IHabit[]>([]);
  const [novoHabito, setNovoHabito] = useState("");
  const [habitoEditando, setHabitoEditando] = useState<number | null>(null);
  const [nomeHabitoEditando, setNomeHabitoEditando] = useState("");
  const [salvandoHabito, setSalvandoHabito] = useState(false);

  // =========================================================
  // CARREGAR
  // =========================================================

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);

        const db = await initializeDatabase();

        const dados = await buscarConfiguracoes(db);

        setConfiguracoes(dados);

        await alterarModoEscuro(dados.modoEscuro);

        const listaHabitos = await carregarHabitos();

        setHabitos(listaHabitos);

        await sincronizarNotificacoes(db, dados);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);

        Alert.alert("Erro", "Não foi possível carregar suas configurações.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  // =========================================================
  // HANDLE HÁBITOS
  // =========================================================

  async function handleAdicionarHabito() {
    const nome = novoHabito.trim();

    if (!nome) {
      Alert.alert("Nome inválido", "Digite um nome para o hábito.");
      return;
    }

    try {
      setSalvandoHabito(true);

      await adicionarHabito(nome);

      const listaAtualizada = await carregarHabitos();

      setHabitos(listaAtualizada);
      setNovoHabito("");
    } catch (error) {
      console.error("Erro ao adicionar hábito:", error);

      Alert.alert("Erro", "Não foi possível adicionar o hábito.");
    } finally {
      setSalvandoHabito(false);
    }
  }

  function iniciarEdicaoHabito(habito: IHabit) {
    setHabitoEditando(habito.id);
    setNomeHabitoEditando(habito.name);
  }

  function cancelarEdicaoHabito() {
    setHabitoEditando(null);
    setNomeHabitoEditando("");
  }

  async function handleAlterarHabito() {
    if (habitoEditando === null) {
      return;
    }

    const nome = nomeHabitoEditando.trim();

    if (!nome) {
      Alert.alert("Nome inválido", "Digite um nome para o hábito.");
      return;
    }

    try {
      setSalvandoHabito(true);

      await alterarHabito(habitoEditando, nome);

      const listaAtualizada = await carregarHabitos();

      setHabitos(listaAtualizada);

      cancelarEdicaoHabito();
    } catch (error) {
      console.error("Erro ao alterar hábito:", error);

      Alert.alert("Erro", "Não foi possível alterar o hábito.");
    } finally {
      setSalvandoHabito(false);
    }
  }

  function confirmarRemocaoHabito(habito: IHabit) {
    Alert.alert(
      "Excluir hábito",
      `Deseja realmente excluir o hábito "${habito.name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setSalvandoHabito(true);

              await removerHabito(habito.id);

              const listaAtualizada = await carregarHabitos();

              setHabitos(listaAtualizada);

              if (habitoEditando === habito.id) {
                cancelarEdicaoHabito();
              }
            } catch (error) {
              console.error("Erro ao excluir hábito:", error);

              Alert.alert("Erro", "Não foi possível excluir o hábito.");
            } finally {
              setSalvandoHabito(false);
            }
          },
        },
      ],
    );
  }

  // =========================================================
  // HANDLE DADOS
  // =========================================================

  async function handleApagarTodosDados() {
    Alert.alert(
      "Apagar todos os dados",
      "Essa ação apagará permanentemente todos os seus registros, hábitos, estudos, sono, água, cigarros, métricas e configurações.\n\nEssa ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Apagar tudo",
          style: "destructive",
          onPress: async () => {
            try {
              setSalvando(true);

              await limparTodosDados();

              await cancelarNotificacoesFixas();
              await cancelarNotificacaoInsight();

              await alterarModoEscuro(false);

              const db = await initializeDatabase();

              const dados = await buscarConfiguracoes(db);

              setConfiguracoes(dados);

              setHabitos([]);
              setNovoHabito("");

              cancelarEdicaoHabito();

              await sincronizarNotificacoes(db, dados);

              Alert.alert(
                "Dados apagados",
                "Todos os seus dados foram apagados com sucesso. As configurações voltaram aos valores padrão.",
              );
            } catch (error) {
              console.error("Erro ao apagar todos os dados:", error);

              Alert.alert("Erro", "Não foi possível apagar todos os dados.");
            } finally {
              setSalvando(false);
            }
          },
        },
      ],
    );
  }

  async function handleSalvarConfiguracoes() {
    if (!configuracoes) {
      return;
    }

    const erro = validarConfiguracoes(configuracoes);

    if (erro) {
      Alert.alert("Configuração inválida", erro);
      return;
    }

    try {
      setSalvando(true);

      const db = await initializeDatabase();

      await salvarConfiguracoes(db, configuracoes);

      await alterarModoEscuro(configuracoes.modoEscuro);

      await sincronizarNotificacoes(db, configuracoes);

      Alert.alert(
        "Configurações salvas",
        "Suas configurações foram salvas com sucesso.",
      );
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);

      Alert.alert("Erro", "Não foi possível salvar as configurações.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExportarJSON() {
    try {
      setSalvando(true);

      await exportarDadosJSON();
    } catch (error) {
      console.error("Erro ao exportar dados em JSON:", error);

      Alert.alert("Erro", "Não foi possível exportar seus dados em JSON.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExportarCSV() {
    try {
      setSalvando(true);

      await exportarDadosCSV();
    } catch (error) {
      console.error("Erro ao exportar dados em CSV:", error);

      Alert.alert("Erro", "Não foi possível exportar seus dados em CSV.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleImportarJSON() {
    Alert.alert(
      "Importar backup",
      "A importação substituirá todos os dados atuais do aplicativo pelos dados do backup selecionado.\n\nEssa ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: async () => {
            try {
              setSalvando(true);

              const resultado = await importarDadosJSON();

              if (!resultado.importado) {
                return;
              }

              const db = await initializeDatabase();

              const dados = await buscarConfiguracoes(db);

              setConfiguracoes(dados);

              await alterarModoEscuro(dados.modoEscuro);

              const listaHabitos = await carregarHabitos();

              setHabitos(listaHabitos);

              await sincronizarNotificacoes(db, dados);

              Alert.alert(
                "Backup restaurado",
                `${resultado.quantidadeDias} dia(s) foram restaurados com sucesso.`,
              );
            } catch (error) {
              console.error("Erro ao importar backup:", error);

              Alert.alert(
                "Erro",
                error instanceof Error
                  ? error.message
                  : "Não foi possível importar o backup.",
              );
            } finally {
              setSalvando(false);
            }
          },
        },
      ],
    );
  }

  // =========================================================
  // CARREGANDO
  // =========================================================

  if (carregando) {
    return (
      <ScreenContainer>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={colors.iconConfig} />

          <Text
            style={{
              marginTop: 12,
              opacity: 0.6,
              color: colors.iconConfig,
            }}
          >
            Carregando configurações...
          </Text>
        </View>

        <BottomNavigation />
      </ScreenContainer>
    );
  }

  // =========================================================
  // TELA
  // =========================================================

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        nestedScrollEnabled
      >
        {/* =====================================================
            TÍTULO
        ===================================================== */}

        <Cabecalho
          title="Configurações"
          subtitle={
            configuracoes?.nome
              ? `Olá, ${configuracoes.nome}! Personalize sua experiência no aplicativo`
              : "Personalize sua experiência no aplicativo"
          }
        />

        {/* =====================================================
            PERFIL
        ===================================================== */}

        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome</Text>

              <TextInput
                placeholder="Digite seu nome"
                placeholderTextColor={colors.placeholder}
                style={globalStyles.input}
                value={configuracoes?.nome ?? ""}
                onChangeText={(nome) =>
                  setConfiguracoes((anterior) =>
                    anterior
                      ? {
                          ...anterior,
                          nome,
                        }
                      : anterior,
                  )
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sobrenome</Text>

              <TextInput
                placeholder="Digite seu sobrenome"
                placeholderTextColor={colors.placeholder}
                style={globalStyles.input}
                value={configuracoes?.sobrenome ?? ""}
                onChangeText={(sobrenome) =>
                  setConfiguracoes((anterior) =>
                    anterior
                      ? {
                          ...anterior,
                          sobrenome,
                        }
                      : anterior,
                  )
                }
              />
            </View>
          </View>
        </View>

        {/* =====================================================
            APARÊNCIA
        ===================================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>

          <View style={styles.card}>
            <SettingOption
              icon={
                <Ionicons
                  name="moon-outline"
                  size={22}
                  color={colors.iconConfig}
                />
              }
              title="Dark Mode"
              description="Ativar aparência escura"
              rightContent={
                <Switch
                  value={configuracoes?.modoEscuro ?? false}
                  onValueChange={async (valor) => {
                    setConfiguracoes((anterior) =>
                      anterior
                        ? {
                            ...anterior,
                            modoEscuro: valor,
                          }
                        : anterior,
                    );

                    await alterarModoEscuro(valor);
                  }}
                />
              }
            />
          </View>
        </View>

        {/* =====================================================
            O QUE ACOMPANHAR
        ===================================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que acompanhar</Text>

          <View style={styles.card}>
            <SettingOption
              icon={
                <Ionicons
                  name="options-outline"
                  size={22}
                  color={colors.iconConfig}
                />
              }
              title="Itens acompanhados"
              description="Escolha quais informações deseja acompanhar"
            />

            <View style={styles.divider} />

            {/* SONO */}
            <SettingOption
              icon={<Text style={{ fontSize: 20 }}>😴</Text>}
              title="Sono"
              description="Acompanhar seu sono e sonecas"
              rightContent={
                <Switch
                  value={configuracoes?.acompanharSono ?? true}
                  onValueChange={(valor) => {
                    setConfiguracoes((anterior) =>
                      anterior
                        ? {
                            ...anterior,
                            acompanharSono: valor,
                          }
                        : anterior,
                    );
                  }}
                />
              }
            />

            {/* ESTUDOS */}
            <SettingOption
              icon={<Text style={{ fontSize: 20 }}>📚</Text>}
              title="Estudos"
              description="Acompanhar tempo de estudo e questões"
              rightContent={
                <Switch
                  value={configuracoes?.acompanharEstudos ?? true}
                  onValueChange={(valor) => {
                    setConfiguracoes((anterior) =>
                      anterior
                        ? {
                            ...anterior,
                            acompanharEstudos: valor,
                          }
                        : anterior,
                    );
                  }}
                />
              }
            />

            {/* LEITURA */}
            <SettingOption
              icon={<Text style={{ fontSize: 20 }}>📖</Text>}
              title="Leitura"
              description="Acompanhar leitura"
              rightContent={
                <Switch
                  value={configuracoes?.acompanharLeitura ?? true}
                  onValueChange={(valor) => {
                    setConfiguracoes((anterior) =>
                      anterior
                        ? {
                            ...anterior,
                            acompanharLeitura: valor,
                          }
                        : anterior,
                    );
                  }}
                />
              }
            />

            {/* ÁGUA */}
            <SettingOption
              icon={<Text style={{ fontSize: 20 }}>💧</Text>}
              title="Água"
              description="Acompanhar consumo de água"
              rightContent={
                <Switch
                  value={configuracoes?.acompanharAgua ?? true}
                  onValueChange={(valor) => {
                    setConfiguracoes((anterior) =>
                      anterior
                        ? {
                            ...anterior,
                            acompanharAgua: valor,
                          }
                        : anterior,
                    );
                  }}
                />
              }
            />

            {/* HUMOR */}
            <SettingOption
              icon={<Text style={{ fontSize: 20 }}>🧠</Text>}
              title="Humor"
              description="Acompanhar seu humor diário"
              rightContent={
                <Switch
                  value={configuracoes?.acompanharHumor ?? true}
                  onValueChange={(valor) => {
                    setConfiguracoes((anterior) =>
                      anterior
                        ? {
                            ...anterior,
                            acompanharHumor: valor,
                          }
                        : anterior,
                    );
                  }}
                />
              }
            />

            {/* ENERGIA */}
            <SettingOption
              icon={<Text style={{ fontSize: 20 }}>⚡</Text>}
              title="Energia"
              description="Acompanhar seu nível de energia"
              rightContent={
                <Switch
                  value={configuracoes?.acompanharEnergia ?? true}
                  onValueChange={(valor) => {
                    setConfiguracoes((anterior) =>
                      anterior
                        ? {
                            ...anterior,
                            acompanharEnergia: valor,
                          }
                        : anterior,
                    );
                  }}
                />
              }
            />

            {/* HÁBITOS */}
            <SettingOption
              icon={<Text style={{ fontSize: 20 }}>✅</Text>}
              title="Hábitos"
              description="Acompanhar seus hábitos diários"
              rightContent={
                <Switch
                  value={configuracoes?.acompanharHabitos ?? true}
                  onValueChange={(valor) => {
                    setConfiguracoes((anterior) =>
                      anterior
                        ? {
                            ...anterior,
                            acompanharHabitos: valor,
                          }
                        : anterior,
                    );
                  }}
                />
              }
            />

            {/* CIGARROS */}
            <SettingOption
              icon={<Text style={{ fontSize: 20 }}>🚬</Text>}
              title="Cigarros"
              description="Acompanhar quantidade de cigarros"
              rightContent={
                <Switch
                  value={configuracoes?.acompanharCigarros ?? false}
                  onValueChange={(valor) => {
                    setConfiguracoes((anterior) =>
                      anterior
                        ? {
                            ...anterior,
                            acompanharCigarros: valor,
                          }
                        : anterior,
                    );
                  }}
                />
              }
            />
          </View>
        </View>

        {/* =====================================================
            METAS
        ===================================================== */}

        {configuracoes &&
          (configuracoes.acompanharCigarros ||
            configuracoes.acompanharSono ||
            configuracoes.acompanharEstudos ||
            configuracoes.acompanharAgua ||
            configuracoes.acompanharLeitura ||
            configuracoes.acompanharHabitos) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Metas</Text>

              <View style={styles.card}>
                <SettingOption
                  icon={
                    <Ionicons
                      name="trophy-outline"
                      size={22}
                      color={colors.iconConfig}
                    />
                  }
                  title="Definir metas"
                  description="Personalize suas metas diárias"
                />

                <View style={styles.divider} />

                {/* CIGARROS */}
                {configuracoes.acompanharCigarros && (
                  <SettingOption
                    icon={<Text style={{ fontSize: 20 }}>🚬</Text>}
                    title="Cigarros por dia"
                    description="Quantidade máxima diária"
                    rightContent={
                      <TextInput
                        keyboardType="numeric"
                        style={styles.smallInput}
                        value={String(configuracoes.metaCigarros)}
                        onChangeText={(valor) =>
                          setConfiguracoes((anterior) =>
                            anterior
                              ? {
                                  ...anterior,
                                  metaCigarros: Number(valor),
                                }
                              : anterior,
                          )
                        }
                        placeholder="Qtd"
                        placeholderTextColor={colors.placeholder}
                      />
                    }
                  />
                )}

                {/* SONO */}
                {configuracoes.acompanharSono && (
                  <SettingOption
                    icon={<Text style={{ fontSize: 20 }}>😴</Text>}
                    title="Sono por dia"
                    description="Quantidade de horas desejadas"
                    rightContent={
                      <TextInput
                        keyboardType="numeric"
                        style={styles.smallInput}
                        value={String(configuracoes.metaSono)}
                        onChangeText={(valor) =>
                          setConfiguracoes((anterior) =>
                            anterior
                              ? {
                                  ...anterior,
                                  metaSono: Number(valor),
                                }
                              : anterior,
                          )
                        }
                        placeholder="Horas"
                        placeholderTextColor={colors.placeholder}
                      />
                    }
                  />
                )}

                {/* ESTUDOS */}
                {configuracoes.acompanharEstudos && (
                  <>
                    <SettingOption
                      icon={<Text style={{ fontSize: 20 }}>📚</Text>}
                      title="Estudo por dia"
                      description="Meta diária em minutos"
                      rightContent={
                        <TextInput
                          keyboardType="numeric"
                          style={styles.smallInput}
                          value={String(configuracoes.metaEstudo)}
                          onChangeText={(valor) =>
                            setConfiguracoes((anterior) =>
                              anterior
                                ? {
                                    ...anterior,
                                    metaEstudo: Number(valor),
                                  }
                                : anterior,
                            )
                          }
                          placeholder="Minutos"
                          placeholderTextColor={colors.placeholder}
                        />
                      }
                    />

                    <SettingOption
                      icon={<Text style={{ fontSize: 20 }}>📝</Text>}
                      title="Questões por dia"
                      description="Quantidade desejada"
                      rightContent={
                        <TextInput
                          keyboardType="numeric"
                          style={styles.smallInput}
                          value={String(configuracoes.metaQuestoes)}
                          onChangeText={(valor) =>
                            setConfiguracoes((anterior) =>
                              anterior
                                ? {
                                    ...anterior,
                                    metaQuestoes: Number(valor),
                                  }
                                : anterior,
                            )
                          }
                          placeholder="Qtd"
                          placeholderTextColor={colors.placeholder}
                        />
                      }
                    />
                  </>
                )}

                {/* LEITURA */}
                {configuracoes.acompanharLeitura && (
                  <SettingOption
                    icon={<Text style={{ fontSize: 20 }}>📖</Text>}
                    title="Leitura por dia"
                    description="Quantidade desejada de páginas"
                    rightContent={
                      <TextInput
                        keyboardType="numeric"
                        style={styles.smallInput}
                        value={String(configuracoes.metaLeitura)}
                        onChangeText={(valor) =>
                          setConfiguracoes((anterior) =>
                            anterior
                              ? {
                                  ...anterior,
                                  metaLeitura: Number(valor),
                                }
                              : anterior,
                          )
                        }
                        placeholder="Páginas"
                        placeholderTextColor={colors.placeholder}
                      />
                    }
                  />
                )}

                {/* ÁGUA */}
                {configuracoes.acompanharAgua && (
                  <SettingOption
                    icon={<Text style={{ fontSize: 20 }}>💧</Text>}
                    title="Água por dia"
                    description="Quantidade em ml"
                    rightContent={
                      <TextInput
                        keyboardType="numeric"
                        style={styles.smallInput}
                        value={String(configuracoes.metaAgua)}
                        onChangeText={(valor) =>
                          setConfiguracoes((anterior) =>
                            anterior
                              ? {
                                  ...anterior,
                                  metaAgua: Number(valor),
                                }
                              : anterior,
                          )
                        }
                        placeholder="ml"
                        placeholderTextColor={colors.placeholder}
                      />
                    }
                  />
                )}

                {/* HÁBITOS */}
                {configuracoes.acompanharHabitos && (
                  <SettingOption
                    icon={<Text style={{ fontSize: 20 }}>✅</Text>}
                    title="Hábitos"
                    description="Meta de conclusão diária"
                    rightContent={
                      <TextInput
                        keyboardType="numeric"
                        style={styles.smallInput}
                        value={String(configuracoes.metaHabitos)}
                        onChangeText={(valor) =>
                          setConfiguracoes((anterior) =>
                            anterior
                              ? {
                                  ...anterior,
                                  metaHabitos: Number(valor),
                                }
                              : anterior,
                          )
                        }
                        placeholder="%"
                        placeholderTextColor={colors.placeholder}
                      />
                    }
                  />
                )}
              </View>
            </View>
          )}

        {/* =====================================================
            LEMBRETES
        ===================================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lembretes</Text>

          <View style={styles.card}>
            <SettingOption
              icon={
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={colors.iconConfig}
                />
              }
              title="Horários dos lembretes"
              description="Defina quando deseja receber lembretes"
            />

            <View style={styles.divider} />

            <View style={styles.remindersGrid}>
              {/* COLUNA ESQUERDA */}

              <View style={styles.remindersColumn}>
                {/* ÁGUA */}

                {configuracoes?.acompanharAgua && (
                  <View style={styles.reminderGroup}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>💧 Água</Text>

                      <Text style={styles.settingDescription}>
                        Lembretes para beber água
                      </Text>
                    </View>

                    {configuracoes.lembreteAgua.map((horario, index) => (
                      <View style={styles.timeRow} key={`agua-${index}`}>
                        <TextInput
                          keyboardType="numeric"
                          style={styles.timeInput}
                          value={horario}
                          onChangeText={(valor) =>
                            setConfiguracoes((anterior) =>
                              anterior
                                ? alterarHorario(
                                    anterior,
                                    "agua",
                                    index,
                                    formatarHorario(valor),
                                  )
                                : anterior,
                            )
                          }
                          placeholder="HHMM"
                          placeholderTextColor={colors.placeholder}
                          maxLength={5}
                        />

                        <TouchableOpacity
                          style={styles.removeTimeButton}
                          onPress={() =>
                            setConfiguracoes((anterior) =>
                              anterior
                                ? removerHorario(anterior, "agua", index)
                                : anterior,
                            )
                          }
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color={colors.iconConfig}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}

                    <TouchableOpacity
                      style={styles.addTimeButton}
                      onPress={() =>
                        setConfiguracoes((anterior) =>
                          anterior
                            ? adicionarHorario(anterior, "agua")
                            : anterior,
                        )
                      }
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color={colors.iconConfig}
                      />

                      <Text style={styles.addTimeText}>Adicionar horário</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* COLUNA DIREITA */}

              <View style={styles.remindersColumn}>
                {/* ESTUDOS */}

                {configuracoes?.acompanharEstudos && (
                  <View style={styles.reminderGroup}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>📚 Estudos</Text>

                      <Text style={styles.settingDescription}>
                        Lembretes para estudar
                      </Text>
                    </View>

                    {configuracoes.lembreteEstudos.map((horario, index) => (
                      <View style={styles.timeRow} key={`estudos-${index}`}>
                        <TextInput
                          keyboardType="numeric"
                          style={styles.timeInput}
                          value={horario}
                          onChangeText={(valor) =>
                            setConfiguracoes((anterior) =>
                              anterior
                                ? alterarHorario(
                                    anterior,
                                    "estudos",
                                    index,
                                    formatarHorario(valor),
                                  )
                                : anterior,
                            )
                          }
                          placeholder="HHMM"
                          placeholderTextColor={colors.placeholder}
                          maxLength={5}
                        />

                        <TouchableOpacity
                          style={styles.removeTimeButton}
                          onPress={() =>
                            setConfiguracoes((anterior) =>
                              anterior
                                ? removerHorario(anterior, "estudos", index)
                                : anterior,
                            )
                          }
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color={colors.iconConfig}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}

                    <TouchableOpacity
                      style={styles.addTimeButton}
                      onPress={() =>
                        setConfiguracoes((anterior) =>
                          anterior
                            ? adicionarHorario(anterior, "estudos")
                            : anterior,
                        )
                      }
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color={colors.iconConfig}
                      />

                      <Text style={styles.addTimeText}>Adicionar horário</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* LEITURA */}

                {configuracoes?.acompanharLeitura && (
                  <View style={[styles.reminderGroup, { marginTop: 20 }]}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>📖 Leitura</Text>

                      <Text style={styles.settingDescription}>
                        Lembretes para ler
                      </Text>
                    </View>

                    {configuracoes.lembreteLeitura.map((horario, index) => (
                      <View style={styles.timeRow} key={`leitura-${index}`}>
                        <TextInput
                          keyboardType="numeric"
                          style={styles.timeInput}
                          value={horario}
                          onChangeText={(valor) =>
                            setConfiguracoes((anterior) =>
                              anterior
                                ? alterarHorario(
                                    anterior,
                                    "leitura",
                                    index,
                                    formatarHorario(valor),
                                  )
                                : anterior,
                            )
                          }
                          placeholder="HHMM"
                          placeholderTextColor={colors.placeholder}
                          maxLength={5}
                        />

                        <TouchableOpacity
                          style={styles.removeTimeButton}
                          onPress={() =>
                            setConfiguracoes((anterior) =>
                              anterior
                                ? removerHorario(anterior, "leitura", index)
                                : anterior,
                            )
                          }
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color={colors.iconConfig}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}

                    <TouchableOpacity
                      style={styles.addTimeButton}
                      onPress={() =>
                        setConfiguracoes((anterior) =>
                          anterior
                            ? adicionarHorario(anterior, "leitura")
                            : anterior,
                        )
                      }
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color={colors.iconConfig}
                      />

                      <Text style={styles.addTimeText}>Adicionar horário</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            {/* REGISTRO DIÁRIO */}

            <SettingOption
              icon={<Text style={{ fontSize: 20 }}>📝</Text>}
              title="Registro diário"
              description="Lembrete para registrar o dia"
              rightContent={
                <TextInput
                  keyboardType="numeric"
                  style={styles.timeInput}
                  value={configuracoes?.lembreteRegistro ?? ""}
                  onChangeText={(valor) =>
                    setConfiguracoes((anterior) =>
                      anterior
                        ? alterarLembreteIndividual(
                            anterior,
                            "lembreteRegistro",
                            valor,
                          )
                        : anterior,
                    )
                  }
                  placeholder="HHMM"
                  placeholderTextColor={colors.placeholder}
                  maxLength={5}
                />
              }
            />

            {/* CIGARROS */}

            {configuracoes?.acompanharCigarros &&
              configuracoes.lembreteCigarros.map((horario, index) => {
                const periodo =
                  index === 0 ? "manhã" : index === 1 ? "tarde" : "noite";

                return (
                  <SettingOption
                    key={`cigarros-${index}`}
                    icon={<Text style={{ fontSize: 20 }}>🚬</Text>}
                    title={`Cigarros pela ${periodo}`}
                    description={`Lembrete para registrar os cigarros da ${periodo}`}
                    rightContent={
                      <TextInput
                        keyboardType="numeric"
                        style={styles.timeInput}
                        value={horario}
                        onChangeText={(valor) => {
                          const horarioFormatado = formatarHorario(valor);

                          setConfiguracoes((anterior) => {
                            if (!anterior) {
                              return anterior;
                            }

                            const novosHorarios = [
                              ...anterior.lembreteCigarros,
                            ];

                            novosHorarios[index] = horarioFormatado;

                            return {
                              ...anterior,
                              lembreteCigarros: novosHorarios,
                            };
                          });
                        }}
                        placeholder="HHMM"
                        placeholderTextColor={colors.placeholder}
                        maxLength={5}
                      />
                    }
                  />
                );
              })}

            {/* SONO */}

            {configuracoes?.acompanharSono && (
              <SettingOption
                icon={<Text style={{ fontSize: 20 }}>😴</Text>}
                title="Sono"
                description="Lembrete para registrar o sono"
                rightContent={
                  <TextInput
                    keyboardType="numeric"
                    style={styles.timeInput}
                    value={configuracoes.lembreteSono}
                    onChangeText={(valor) =>
                      setConfiguracoes((anterior) =>
                        anterior
                          ? alterarLembreteIndividual(
                              anterior,
                              "lembreteSono",
                              valor,
                            )
                          : anterior,
                      )
                    }
                    placeholder="HHMM"
                    placeholderTextColor={colors.placeholder}
                    maxLength={5}
                  />
                }
              />
            )}

            {/* REVISÃO */}

            <SettingOption
              icon={<Text style={{ fontSize: 20 }}>🔄</Text>}
              title="Revisão"
              description="Lembrete para revisar o dia"
              rightContent={
                <TextInput
                  keyboardType="numeric"
                  style={styles.timeInput}
                  value={configuracoes?.lembreteRevisao ?? ""}
                  onChangeText={(valor) =>
                    setConfiguracoes((anterior) =>
                      anterior
                        ? alterarLembreteIndividual(
                            anterior,
                            "lembreteRevisao",
                            valor,
                          )
                        : anterior,
                    )
                  }
                  placeholder="HHMM"
                  placeholderTextColor={colors.placeholder}
                  maxLength={5}
                />
              }
            />

            {/* INSIGHT */}

            <SettingOption
              icon={<Text style={{ fontSize: 20 }}>💡</Text>}
              title="Insight semanal"
              description="Horário do insight semanal"
              rightContent={
                <TextInput
                  keyboardType="numeric"
                  style={styles.timeInput}
                  value={configuracoes?.lembreteInsight ?? ""}
                  onChangeText={(valor) =>
                    setConfiguracoes((anterior) =>
                      anterior
                        ? alterarLembreteIndividual(
                            anterior,
                            "lembreteInsight",
                            valor,
                          )
                        : anterior,
                    )
                  }
                  placeholder="HHMM"
                  placeholderTextColor={colors.placeholder}
                  maxLength={5}
                />
              }
            />
          </View>
        </View>

        {/* =====================================================
            HÁBITOS
        ===================================================== */}

        {configuracoes?.acompanharHabitos && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hábitos</Text>

            <View style={styles.card}>
              <SettingOption
                icon={
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={22}
                    color={colors.iconConfig}
                  />
                }
                title="Gerenciar hábitos"
                description="Cadastre, altere ou exclua seus hábitos"
              />

              <View style={styles.divider} />

              {/* CADASTRAR */}

              <View style={styles.habitAddContainer}>
                <Text style={styles.settingTitle}>Novo hábito</Text>

                <View style={styles.habitAddRow}>
                  <TextInput
                    style={styles.habitInput}
                    value={novoHabito}
                    onChangeText={setNovoHabito}
                    placeholder="Ex.: Ler 30 minutos"
                    placeholderTextColor={colors.placeholder}
                    editable={!salvandoHabito}
                  />

                  <TouchableOpacity
                    style={styles.habitAddButton}
                    onPress={handleAdicionarHabito}
                    disabled={salvandoHabito}
                  >
                    <Ionicons name="add" size={22} color={colors.iconConfig} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              {/* LISTA */}

              {habitos.length === 0 ? (
                <View style={styles.emptyHabits}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={28}
                    color={colors.iconConfig}
                  />

                  <Text style={styles.emptyHabitsText}>
                    Nenhum hábito cadastrado.
                  </Text>
                </View>
              ) : (
                habitos.map((habito) => {
                  const editando = habitoEditando === habito.id;

                  return (
                    <View style={styles.habitRow} key={habito.id}>
                      {editando ? (
                        <>
                          <TextInput
                            style={styles.habitInput}
                            value={nomeHabitoEditando}
                            onChangeText={setNomeHabitoEditando}
                            autoFocus
                            editable={!salvandoHabito}
                          />

                          <TouchableOpacity
                            style={styles.habitActionButton}
                            onPress={handleAlterarHabito}
                            disabled={salvandoHabito}
                          >
                            <Ionicons
                              name="checkmark-outline"
                              size={21}
                              color={colors.iconConfig}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.habitActionButton}
                            onPress={cancelarEdicaoHabito}
                            disabled={salvandoHabito}
                          >
                            <Ionicons
                              name="close-outline"
                              size={21}
                              color={colors.iconConfig}
                            />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <View style={styles.habitInfo}>
                            <Ionicons
                              name="checkmark-circle-outline"
                              size={20}
                              color={colors.iconConfig}
                            />

                            <Text style={styles.habitName}>{habito.name}</Text>
                          </View>

                          <TouchableOpacity
                            style={styles.habitActionButton}
                            onPress={() => iniciarEdicaoHabito(habito)}
                            disabled={salvandoHabito}
                          >
                            <Ionicons
                              name="create-outline"
                              size={20}
                              color={colors.iconConfig}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.habitActionButton}
                            onPress={() => confirmarRemocaoHabito(habito)}
                            disabled={salvandoHabito}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={20}
                              color={colors.iconConfig}
                            />
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}

        {/* =====================================================
            DADOS
        ===================================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados</Text>

          <View style={styles.card}>
            {/* EXPORTAR JSON */}

            <TouchableOpacity
              style={styles.exportButton}
              onPress={handleExportarJSON}
              disabled={salvando}
              activeOpacity={0.7}
            >
              <View style={styles.exportButtonIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color={colors.iconConfig}
                />
              </View>

              <View style={styles.exportButtonContent}>
                <Text style={styles.exportButtonTitle}>
                  Exportar dados em JSON
                </Text>

                <Text style={styles.exportButtonDescription}>
                  Backup completo dos dados do aplicativo
                </Text>
              </View>

              <Ionicons
                name="share-outline"
                size={20}
                color={colors.iconConfig}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* EXPORTAR CSV */}

            <TouchableOpacity
              style={styles.exportButton}
              onPress={handleExportarCSV}
              disabled={salvando}
              activeOpacity={0.7}
            >
              <View style={styles.exportButtonIcon}>
                <Ionicons
                  name="grid-outline"
                  size={22}
                  color={colors.iconConfig}
                />
              </View>

              <View style={styles.exportButtonContent}>
                <Text style={styles.exportButtonTitle}>
                  Exportar dados em CSV
                </Text>

                <Text style={styles.exportButtonDescription}>
                  Dados organizados para Excel ou Google Planilhas
                </Text>
              </View>

              <Ionicons
                name="share-outline"
                size={20}
                color={colors.iconConfig}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* IMPORTAR BACKUP */}

            <TouchableOpacity
              style={styles.exportButton}
              onPress={handleImportarJSON}
              disabled={salvando}
              activeOpacity={0.7}
            >
              <View style={styles.exportButtonIcon}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={22}
                  color={colors.iconConfig}
                />
              </View>

              <View style={styles.exportButtonContent}>
                <Text style={styles.exportButtonTitle}>Importar backup</Text>

                <Text style={styles.exportButtonDescription}>
                  Restaurar dados a partir de um arquivo JSON
                </Text>
              </View>

              <Ionicons
                name="folder-open-outline"
                size={20}
                color={colors.iconConfig}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* =====================================================
            ZONA DE PERIGO
        ===================================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zona de perigo</Text>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleApagarTodosDados}
            disabled={salvando}
          >
            <Ionicons
              name="trash-outline"
              size={22}
              color={colors.deleteConfigText}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.deleteTitle}>Apagar todos os dados</Text>

              <Text style={styles.deleteDescription}>
                Remove permanentemente todos os registros
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* =====================================================
            SALVAR
        ===================================================== */}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSalvarConfiguracoes}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="save-outline" size={22} color={colors.white} />

              <Text style={styles.saveButtonText}>Salvar configurações</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation />
    </ScreenContainer>
  );
}
