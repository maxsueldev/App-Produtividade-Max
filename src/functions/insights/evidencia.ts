import type { InsightCandidato, InsightEvidencia, InsightTipo } from "./tipos";

export function criarCandidato(
  tipo: InsightTipo,
  mensagem: string,
  pontuacao: number,
  evidencias: InsightEvidencia[],
): InsightCandidato {
  return {
    tipo,
    mensagem,
    pontuacao,
    evidencias,
  };
}
