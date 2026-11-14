export function obterDataAtual(): string {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function formatarHorario(value: string): string {
  const numeros = value.replace(/\D/g, "").slice(0, 4);

  if (numeros.length <= 2) {
    return numeros;
  }

  return `${numeros.slice(0, 2)}:${numeros.slice(2)}`;
}

export function horarioValido(horario: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  return regex.test(horario);
}

export function obterSaudacao(nome?: string): string {
  const hora = new Date().getHours();

  let saudacao: string;

  if (hora >= 5 && hora < 12) {
    saudacao = "Bom dia";
  } else if (hora >= 12 && hora < 18) {
    saudacao = "Boa tarde";
  } else {
    saudacao = "Boa noite";
  }

  const nomePerfil = [nome?.trim()].filter(Boolean).join(" ");

  if (nomePerfil) {
    return `${saudacao}, ${nomePerfil}! ${
      saudacao === "Bom dia" ? "🌅" : saudacao === "Boa tarde" ? "☀️" : "🌙"
    }`;
  }

  return `${saudacao}! ${
    saudacao === "Bom dia" ? "🌅" : saudacao === "Boa tarde" ? "☀️" : "🌙"
  }`;
}

export function obterDataFormatada(): string {
  const agora = new Date();

  const diasDaSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const diaSemana = diasDaSemana[agora.getDay()];
  const dia = agora.getDate();
  const mes = meses[agora.getMonth()];

  return `${diaSemana}, ${dia} de ${mes}`;
}

export function calcularDuracaoSono(
  sleepTime: string,
  wakeTime: string,
): number | null {
  if (!sleepTime || !wakeTime) {
    return null;
  }

  const [sleepHour, sleepMinute] = sleepTime.split(":").map(Number);
  const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);

  if (
    Number.isNaN(sleepHour) ||
    Number.isNaN(sleepMinute) ||
    Number.isNaN(wakeHour) ||
    Number.isNaN(wakeMinute)
  ) {
    return null;
  }

  let sleepMinutes = sleepHour * 60 + sleepMinute;
  let wakeMinutes = wakeHour * 60 + wakeMinute;

  if (wakeMinutes <= sleepMinutes) {
    wakeMinutes += 24 * 60;
  }

  return wakeMinutes - sleepMinutes;
}

export function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

export function formatarMinutos(minutos: number | null): string {
  if (minutos === null || minutos <= 0) {
    return "Não informado";
  }

  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (horas === 0) {
    return `${minutosRestantes}min`;
  }

  if (minutosRestantes === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${minutosRestantes}min`;
}

export function numeroValido(
  valor: number,
  minimo: number,
  maximo?: number,
): boolean {
  if (!Number.isFinite(valor)) {
    return false;
  }

  if (!Number.isInteger(valor)) {
    return false;
  }

  if (valor < minimo) {
    return false;
  }

  if (maximo !== undefined && valor > maximo) {
    return false;
  }

  return true;
}

export function formatarDuracao(minutos: number): string {
  if (minutos <= 0) return "0min";

  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (horas === 0) {
    return `${minutosRestantes}min`;
  }

  if (minutosRestantes === 0) {
    return `${horas}h`;
  }

  return `${horas}h${String(minutosRestantes).padStart(2, "0")}`;
}

export function formatarAgua(ml: number): string {
  return `${(ml / 1000).toFixed(1).replace(".", ",")}L`;
}
