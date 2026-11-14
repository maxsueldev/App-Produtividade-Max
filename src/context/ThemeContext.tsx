import { initializeDatabase } from "@/database/database";
import { saveSetting } from "@/database/settings";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextData {
  modoEscuro: boolean;
  alterarModoEscuro: (valor: boolean) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [modoEscuro, setModoEscuro] = useState(false);

  useEffect(() => {
    async function carregarTema() {
      try {
        const db = await initializeDatabase();

        const resultado = await db.getFirstAsync<{ value: string }>(
          `
            SELECT value
            FROM settings
            WHERE key = ?
          `,
          "modo_escuro",
        );

        setModoEscuro(resultado?.value === "1");
      } catch (error) {
        console.error("Erro ao carregar tema:", error);
      }
    }

    carregarTema();
  }, []);

  async function alterarModoEscuro(valor: boolean) {
    try {
      const db = await initializeDatabase();

      await saveSetting(db, "modo_escuro", valor ? "1" : "0");

      setModoEscuro(valor);
    } catch (error) {
      console.error("Erro ao alterar modo escuro:", error);
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        modoEscuro,
        alterarModoEscuro,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const contexto = useContext(ThemeContext);

  if (!contexto) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }

  return contexto;
}
