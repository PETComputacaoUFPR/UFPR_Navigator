import { useMemo } from "react";
import db from "../data/classrooms.json";

/**
 * Representa uma sala (ponto no mapa).
 */
export type Sala = {
  id_sala: number;
  n_sala: string; // ex: "PA-01"
  latitude: number;
  longitude: number;
  unidade_adm: number;
};

type DB = {
  salas: Sala[];
};

/**
 * Normaliza termo para busca exata.
 *
 * @param {string} raw
 * @returns {string}
 */
function normalizeSalaTerm(raw: string): string {
  const t = raw.trim().toLowerCase().replace(/\s+/g, "");
  if (!t.includes("-")) {
    const m = t.match(/^pa(\d{1,2})$/);
    if (m) return `pa-${m[1].padStart(2, "0")}`;
  }
  return t;
}

/**
 * Normaliza termo para matching (autocomplete).
 * Remove espaços e hífen para permitir "pa01", "pa 01", "pa-01".
 *
 * @param {string} raw
 * @returns {string}
 */
function normalizeForMatch(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
}

/**
 * Hook: busca sala exata + sugestões por digitação.
 *
 * @returns {{
 *  findSala: (termRaw: string) => Sala | null,
 *  getSalaSuggestions: (query: string, limit?: number) => Sala[]
 * }}
 */
export function useSalaSearch() {
  const salas = useMemo(() => ((db as DB).salas || []) as Sala[], []);

  const salaIndex = useMemo(() => {
    const idx = new Map<string, Sala>();
    salas.forEach((s) => idx.set(s.n_sala.toLowerCase(), s));
    return idx;
  }, [salas]);

  /**
   * Busca exata (após normalização).
   *
   * @param {string} termRaw
   * @returns {Sala | null}
   */
  function findSala(termRaw: string): Sala | null {
    const key = normalizeSalaTerm(termRaw);
    return salaIndex.get(key) || null;
  }

  /**
   * Retorna sugestões ordenadas com base no que o usuário está digitando.
   *
   * Regras:
   * - match ignora espaços e hífen
   * - prioridade para "startsWith", depois "includes"
   *
   * @param {string} query
   * @param {number} [limit=8]
   * @returns {Sala[]}
   */
  function getSalaSuggestions(query: string, limit = 8): Sala[] {
    const q = normalizeForMatch(query);
    if (!q) return [];

    const scored = salas
      .map((s) => {
        const key = normalizeForMatch(s.n_sala); // "PA-01" -> "pa01"
        const starts = key.startsWith(q);
        const includes = !starts && key.includes(q);

        const score = starts ? 2 : includes ? 1 : 0;
        return { s, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.s.n_sala.localeCompare(b.s.n_sala);
      })
      .slice(0, limit)
      .map((x) => x.s);

    return scored;
  }

  return { findSala, getSalaSuggestions };
}
