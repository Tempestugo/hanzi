/**
 * server/queries.ts
 * Todas as queries do banco — tipadas e centralizadas
 */

import pool from "./db.js";
import type { RowDataPacket } from "mysql2";

// ============================================================
// TIPOS
// ============================================================
export type EvolutionStage = {
  era: string;
  label: string;
  description: string;
  approx_year: string;
};

export type ExampleWord = {
  hanzi: string;
  pinyin: string;
  meaning_pt: string;
};

export type Character = {
  id: number;
  hanzi: string;
  pinyin: string;
  tone_number: number;
  meaning_pt: string;
  radical: string;
  stroke_count: number;
  category: "pictogram" | "simple_ideogram" | "compound_ideogram" | "phono_semantic" | "loan";
  hsk_level: string | null;
  slug: string;
};

export type CharacterPost = {
  id: number;
  character_id: number;
  module_id: number | null;
  title: string;
  etymology_content: string | null;
  evolution_stages: EvolutionStage[] | null;
  composition_notes: string | null;
  mnemonic: string | null;
  example_words: ExampleWord[] | null;
  published: boolean;
};

export type Module = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  order_index: number;
};

export type CharacterWithPost = Character & {
  post: CharacterPost | null;
};

export type Component = {
  child_hanzi: string;
  child_pinyin: string;
  child_meaning_pt: string;
  child_slug: string;
  role: "semantic" | "phonetic" | "both";
  position: string | null;
};

// ============================================================
// MÓDULOS
// ============================================================

/** Lista todos os módulos ordenados */
export async function getModules(): Promise<Module[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM modules ORDER BY order_index ASC"
  );
  return rows as Module[];
}

/** Busca um módulo pelo slug */
export async function getModuleBySlug(slug: string): Promise<Module | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM modules WHERE slug = ? LIMIT 1",
    [slug]
  );
  return (rows[0] as Module) ?? null;
}

/** Módulo com lista de caracteres publicados */
export async function getModuleWithCharacters(moduleSlug: string): Promise<{
  module: Module | null;
  characters: Character[];
}> {
  const module = await getModuleBySlug(moduleSlug);
  if (!module) return { module: null, characters: [] };

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT c.*
     FROM characters c
     INNER JOIN character_posts cp ON cp.character_id = c.id
     WHERE cp.module_id = ? AND cp.published = 1
     ORDER BY c.hsk_level ASC, c.stroke_count ASC`,
    [module.id]
  );
  return { module, characters: rows as Character[] };
}

// ============================================================
// CARACTERES
// ============================================================

/** Busca um caractere pelo slug */
export async function getCharacterBySlug(slug: string): Promise<Character | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM characters WHERE slug = ? LIMIT 1",
    [slug]
  );
  return (rows[0] as Character) ?? null;
}

/** Busca caractere + post em uma única query */
export async function getCharacterWithPost(slug: string): Promise<CharacterWithPost | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
       c.*,
       cp.id           AS post_id,
       cp.title        AS post_title,
       cp.etymology_content,
       cp.evolution_stages,
       cp.composition_notes,
       cp.mnemonic,
       cp.example_words,
       cp.published
     FROM characters c
     LEFT JOIN character_posts cp ON cp.character_id = c.id AND cp.published = 1
     WHERE c.slug = ?
     LIMIT 1`,
    [slug]
  );

  if (!rows[0]) return null;

  const row = rows[0] as RowDataPacket;

  // MySQL retorna JSON como string — parsear se necessário
  const parseJson = (val: unknown) => {
    if (!val) return null;
    if (typeof val === "string") {
      try { return JSON.parse(val); } catch { return null; }
    }
    return val;
  };

  const character: Character = {
    id:           row.id,
    hanzi:        row.hanzi,
    pinyin:       row.pinyin,
    tone_number:  row.tone_number,
    meaning_pt:   row.meaning_pt,
    radical:      row.radical,
    stroke_count: row.stroke_count,
    category:     row.category,
    hsk_level:    row.hsk_level,
    slug:         row.slug,
  };

  const post: CharacterPost | null = row.post_id
    ? {
        id:                 row.post_id,
        character_id:       row.id,
        module_id:          row.module_id ?? null,
        title:              row.post_title,
        etymology_content:  row.etymology_content ?? null,
        evolution_stages:   parseJson(row.evolution_stages),
        composition_notes:  row.composition_notes ?? null,
        mnemonic:           row.mnemonic ?? null,
        example_words:      parseJson(row.example_words),
        published:          Boolean(row.published),
      }
    : null;

  return { ...character, post };
}

/** Componentes (filhos) de um caractere — para mostrar 木+木=林 */
export async function getCharacterComponents(characterId: number): Promise<Component[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
       child.hanzi       AS child_hanzi,
       child.pinyin      AS child_pinyin,
       child.meaning_pt  AS child_meaning_pt,
       child.slug        AS child_slug,
       cc.role,
       cc.position
     FROM character_components cc
     INNER JOIN characters child ON child.id = cc.child_id
     WHERE cc.parent_id = ?`,
    [characterId]
  );
  return rows as Component[];
}

/** Caracteres onde este aparece como componente (família) */
export async function getCharacterFamily(characterId: number): Promise<Character[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT c.*
     FROM characters c
     INNER JOIN character_components cc ON cc.parent_id = c.id
     WHERE cc.child_id = ?`,
    [characterId]
  );
  return rows as Character[];
}

/** Lista todos os caracteres publicados de uma categoria */
export async function getCharactersByCategory(
  category: Character["category"]
): Promise<Character[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT c.*
     FROM characters c
     INNER JOIN character_posts cp ON cp.character_id = c.id
     WHERE c.category = ? AND cp.published = 1
     ORDER BY c.hsk_level ASC, c.stroke_count ASC`,
    [category]
  );
  return rows as Character[];
}

/** Busca textual simples por hanzi, pinyin ou significado */
export async function searchCharacters(query: string): Promise<Character[]> {
  const term = `%${query}%`;
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM characters
     WHERE hanzi LIKE ? OR pinyin LIKE ? OR meaning_pt LIKE ?
     LIMIT 20`,
    [term, term, term]
  );
  return rows as Character[];
}

/** Todos os slugs publicados — para sitemap / SSG */
export async function getAllPublishedSlugs(): Promise<string[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT c.slug
     FROM characters c
     INNER JOIN character_posts cp ON cp.character_id = c.id
     WHERE cp.published = 1`
  );
  return (rows as RowDataPacket[]).map((r) => r.slug as string);
}
