export function calcularMediaDiaria(
  valores: number[],
  periodo: number,
): number {
  if (periodo <= 0 || valores.length === 0) {
    return 0;
  }

  const total = valores.reduce((soma, valor) => soma + valor, 0);

  return total / periodo;
}

export function calcularTotalHabitos(habitData: { total: number }[]): number {
  return habitData.reduce((total, item) => total + item.total, 0);
}

export function calcularHabitosConcluidos(
  habitData: { completed: number }[],
): number {
  return habitData.reduce((total, item) => total + item.completed, 0);
}

export function calcularPercentual(valor: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return (valor / total) * 100;
}
