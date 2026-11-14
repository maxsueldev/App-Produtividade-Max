# 📱 Produtividade Max

Aplicativo mobile de produtividade desenvolvido com **React Native, TypeScript e Expo**, com o objetivo de centralizar o acompanhamento de hábitos, estudos, sono e atividades diárias em um único lugar.

O projeto foi desenvolvido para transformar o acompanhamento da rotina em algo mais organizado, permitindo registrar atividades, estabelecer metas e visualizar a própria evolução ao longo do tempo.

## 🎯 Objetivo do projeto

O Produtividade Max surgiu da ideia de desenvolver uma ferramenta pessoal para melhorar a organização da rotina e acompanhar diferentes aspectos da produtividade.

A aplicação reúne funcionalidades de monitoramento diário, gerenciamento de hábitos e acompanhamento de indicadores, utilizando armazenamento local para manter os dados diretamente no dispositivo.

## ✨ Funcionalidades

### 😴 Registro de sono
- Registro dos horários de sono.
- Acompanhamento da duração do descanso.
- Histórico dos registros.
- Comparação com metas estabelecidas.

### 📚 Controle de estudos
- Registro de sessões de estudo.
- Acompanhamento do tempo dedicado aos estudos.
- Histórico das atividades.
- Monitoramento das metas de estudo.

### 🚭 Controle de tabagismo
- Registro diário da quantidade de cigarros consumidos.
- Histórico de consumo.
- Acompanhamento da evolução.
- Definição de metas para redução do consumo.

### 🎯 Gerenciamento de hábitos
- Cadastro e organização de hábitos.
- Registro de hábitos realizados diariamente.
- Acompanhamento da consistência.
- Monitoramento das metas estabelecidas.

### 📊 Métricas e evolução
- Centralização dos indicadores diários.
- Acompanhamento dos registros de diferentes atividades.
- Histórico de produtividade.
- Visualização da evolução dos hábitos e metas.

### ⚙️ Configurações
- Personalização do perfil do usuário.
- Definição de metas individuais.
- Configuração de horários de lembretes.
- Alternância entre tema claro e escuro.
- Persistência das preferências no banco de dados local.

### 🔔 Notificações
- Lembretes relacionados à rotina de estudos.
- Lembretes para registro e acompanhamento de hábitos.
- Notificações para hidratação.
- Lembretes relacionados ao sono e à revisão da rotina.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| React Native | Desenvolvimento da interface mobile |
| TypeScript | Tipagem estática e segurança do código |
| Expo | Ambiente e ferramentas de desenvolvimento |
| Expo SQLite | Banco de dados e persistência local |
| React Hooks | Gerenciamento de estados e lógica dos componentes |
| Expo Notifications | Recursos de notificações locais |
| Expo Router | Navegação da aplicação |

## 🗄️ Banco de dados

A aplicação utiliza **SQLite** por meio do Expo SQLite, permitindo armazenar os dados localmente no dispositivo, sem depender de um servidor externo para o funcionamento dos registros.

Entre as tabelas utilizadas estão:

- `days`: organização dos registros diários.
- `sleep_records`: registros de sono.
- `study_sessions`: sessões de estudo.
- `smoking_records`: registros de consumo de cigarros.
- `daily_metrics`: métricas diárias.
- `habits`: cadastro de hábitos.
- `habit_records`: acompanhamento dos hábitos realizados.

A aplicação também utiliza persistência local para as configurações e preferências do usuário.

## 📱 Ambiente de desenvolvimento

O projeto foi desenvolvido utilizando:

- React Native.
- Expo SDK 57.
- TypeScript.
- Expo SQLite.
- Development Build para execução dos recursos nativos.

O desenvolvimento e os testes foram realizados em ambiente Android, utilizando armazenamento local no dispositivo.

## 📌 Características do projeto

- Aplicação mobile com foco em produtividade pessoal.
- Armazenamento local de informações.
- Organização de dados por categorias.
- Metas e acompanhamento de atividades.
- Configurações personalizáveis.
- Interface com suporte a tema claro e escuro.
- Estrutura desenvolvida com TypeScript.

## 🚀 Aprendizados

O desenvolvimento deste projeto proporcionou experiência prática em diferentes aspectos do desenvolvimento mobile:

- Construção de aplicações com React Native.
- Utilização de TypeScript em projetos mobile.
- Gerenciamento de estados e funcionalidades.
- Integração e manipulação de banco de dados SQLite.
- Persistência de dados local.
- Organização de funcionalidades e regras de negócio.
- Configuração de recursos nativos utilizando Expo.

## 👨‍💻 Desenvolvedor

**Maxsuel Fernando Brito de Andrade Santos**

- [LinkedIn](https://linkedin.com/in/maxsuelfernandob/)
- [GitHub](https://github.com/maxsueldev)
- [Portfólio](https://maxsuel-fernando-frontend.vercel.app)

---

⭐ Projeto pessoal desenvolvido para fins de aprendizado e aplicação prática de conhecimentos em desenvolvimento mobile.
