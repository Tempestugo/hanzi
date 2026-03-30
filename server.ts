/**
 * server/index.ts
 * Servidor Express principal
 *
 * Em desenvolvimento: npx tsx server/index.ts
 * Em produção:        node dist/server/index.js
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  getModules,
  getModuleWithCharacters,
  getCharacterWithPost,
  getCharacterComponents,
  getCharacterFamily,
  searchCharacters,
} from "./queries.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ?? 3000;
const isDev = process.env.NODE_ENV !== "production";

// ── Middleware ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Em produção serve o build do Vite
if (!isDev) {
  app.use(express.static(path.join(__dirname, "../client")));
}

// ── Helpers de template ───────────────────────────────────────
function htmlShell(title: string, metaDesc: string, bodyContent: string): string {
  const scriptTag = isDev
    ? `<script type="module" src="http://localhost:5173/@vite/client"></script>\n  <script type="module" src="http://localhost:5173/src/main.tsx"></script>`
    : `<script type="module" src="/assets/index.js"></script>`;
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Hanzi Blog</title>
  <meta name="description" content="${metaDesc}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${metaDesc}" />
  <link rel="stylesheet" href="/assets/index.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body>
  <div id="root">${bodyContent}</div>
  ${scriptTag}
</body>
</html>`;
}

// ── ROTAS DA API (JSON) ───────────────────────────────────────

/** Lista módulos */
app.get("/api/modules", async (_req, res) => {
  try {
    const modules = await getModules();
    res.json({ ok: true, data: modules });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

/** Módulo com seus caracteres */
app.get("/api/modules/:slug", async (req, res) => {
  try {
    const result = await getModuleWithCharacters(req.params.slug);
    if (!result.module) return res.status(404).json({ ok: false, error: "Módulo não encontrado" });
    res.json({ ok: true, data: result });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

/** Caractere completo com post */
app.get("/api/caracteres/:slug", async (req, res) => {
  try {
    const char = await getCharacterWithPost(req.params.slug);
    if (!char) return res.status(404).json({ ok: false, error: "Caractere não encontrado" });

    const [components, family] = await Promise.all([
      getCharacterComponents(char.id),
      getCharacterFamily(char.id),
    ]);

    res.json({ ok: true, data: { character: char, components, family } });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

/** Busca */
app.get("/api/busca", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (!q) return res.json({ ok: true, data: [] });
  try {
    const results = await searchCharacters(q);
    res.json({ ok: true, data: results });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// ── ROTAS SSR (HTML pré-renderizado para SEO) ─────────────────

/** Home */
app.get("/", async (_req, res) => {
  try {
    const modules = await getModules();
    const modulesHtml = modules
      .map(
        (m) => `<a href="/modulos/${m.slug}" class="module-card">
          <h2>${m.title}</h2>
          <p>${m.description ?? ""}</p>
        </a>`
      )
      .join("");

    const html = htmlShell(
      "Aprenda chinês pela etimologia",
      "Descubra a origem e a lógica por trás dos caracteres chineses. Cada traço tem uma história.",
      `<header class="site-header">
        <a href="/" class="logo">漢字<span>Blog</span></a>
        <nav>
          <a href="/modulos/pictogramas">Pictogramas</a>
          <a href="/modulos/ideogramas-compostos">Compostos</a>
          <a href="/modulos/fono-semanticos">Fono-semânticos</a>
        </nav>
      </header>
      <main class="home">
        <section class="hero">
          <h1>Cada traço tem uma história</h1>
          <p>Aprenda chinês pela origem dos caracteres — não pela decoreba.</p>
        </section>
        <section class="modules-grid">${modulesHtml}</section>
      </main>`
    );

    res.send(html);
  } catch (err) {
    res.status(500).send("Erro interno");
  }
});

/** Módulo */
app.get("/modulos/:slug", async (req, res) => {
  try {
    const { module, characters } = await getModuleWithCharacters(req.params.slug);
    if (!module) return res.status(404).send("Módulo não encontrado");

    const charsHtml = characters
      .map(
        (c) => `<a href="/caracteres/${c.slug}" class="char-card">
          <span class="hanzi">${c.hanzi}</span>
          <span class="pinyin">${c.pinyin}</span>
          <span class="meaning">${c.meaning_pt}</span>
        </a>`
      )
      .join("");

    const html = htmlShell(
      module.title,
      module.description ?? "",
      `<header class="site-header">
        <a href="/" class="logo">漢字<span>Blog</span></a>
      </header>
      <main class="module-page">
        <h1>${module.title}</h1>
        <p class="module-desc">${module.description ?? ""}</p>
        <div class="chars-grid">${charsHtml}</div>
      </main>`
    );

    res.send(html);
  } catch (err) {
    res.status(500).send("Erro interno");
  }
});

/** Página do caractere */
app.get("/caracteres/:slug", async (req, res) => {
  try {
    const char = await getCharacterWithPost(req.params.slug);
    if (!char) return res.status(404).send("Caractere não encontrado");

    const [components, family] = await Promise.all([
      getCharacterComponents(char.id),
      getCharacterFamily(char.id),
    ]);

    const post = char.post;
    const evolutionHtml = post?.evolution_stages
      ?.map(
        (s) => `<div class="evolution-stage">
          <span class="era-label">${s.label}</span>
          <span class="era-year">${s.approx_year}</span>
          <p>${s.description}</p>
        </div>`
      )
      .join("") ?? "";

    const examplesHtml = post?.example_words
      ?.map(
        (w) => `<tr>
          <td class="ex-hanzi">${w.hanzi}</td>
          <td class="ex-pinyin">${w.pinyin}</td>
          <td>${w.meaning_pt}</td>
        </tr>`
      )
      .join("") ?? "";

    const componentsHtml = components.length
      ? `<div class="components">
          ${components
            .map(
              (c) => `<a href="/caracteres/${c.child_slug}" class="component-chip">
                <span class="hanzi">${c.child_hanzi}</span>
                <span>${c.child_meaning_pt}</span>
                <span class="role-badge">${c.role}</span>
              </a>`
            )
            .join('<span class="plus">+</span>')}
          <span class="equals">= ${char.hanzi}</span>
        </div>`
      : "";

    const html = htmlShell(
      `${char.hanzi} ${char.pinyin} — ${char.meaning_pt}`,
      post?.etymology_content?.slice(0, 150).replace(/[#*]/g, "") ?? char.meaning_pt,
      `<header class="site-header">
        <a href="/" class="logo">漢字<span>Blog</span></a>
      </header>
      <main class="char-page" data-slug="${char.slug}">
        <div class="char-hero">
          <div class="hanzi-display">${char.hanzi}</div>
          <div class="char-meta">
            <h1>${post?.title ?? char.hanzi}</h1>
            <div class="badges">
              <span class="badge">${char.pinyin} (tom ${char.tone_number})</span>
              <span class="badge">Radical: ${char.radical}</span>
              <span class="badge">${char.stroke_count} traços</span>
              ${char.hsk_level ? `<span class="badge hsk">HSK ${char.hsk_level}</span>` : ""}
            </div>
          </div>
        </div>

        ${componentsHtml}

        ${post?.mnemonic ? `<blockquote class="mnemonic">${post.mnemonic}</blockquote>` : ""}

        ${
          evolutionHtml
            ? `<section class="evolution">
                <h2>Evolução histórica</h2>
                <div class="evolution-timeline">${evolutionHtml}</div>
              </section>`
            : ""
        }

        ${
          post?.etymology_content
            ? `<section class="etymology">
                <h2>Etimologia</h2>
                <div class="md-content" id="etymology-content"
                     data-md="${encodeURIComponent(post.etymology_content)}"></div>
              </section>`
            : ""
        }

        ${
          examplesHtml
            ? `<section class="examples">
                <h2>Palavras com ${char.hanzi}</h2>
                <table><tbody>${examplesHtml}</tbody></table>
              </section>`
            : ""
        }

        ${
          family.length
            ? `<section class="family">
                <h2>Aparece em</h2>
                <div class="family-chips">
                  ${family
                    .map(
                      (f) => `<a href="/caracteres/${f.slug}" class="family-chip">
                        <span class="hanzi">${f.hanzi}</span>
                        <span>${f.meaning_pt}</span>
                      </a>`
                    )
                    .join("")}
                </div>
              </section>`
            : ""
        }
      </main>`
    );

    res.send(html);
  } catch (err) {
    res.status(500).send("Erro interno");
  }
});

/** Sitemap XML para SEO */
app.get("/sitemap.xml", async (_req, res) => {
  try {
    const { getAllPublishedSlugs } = await import("./queries.js");
    const slugs = await getAllPublishedSlugs();
    const base = process.env.SITE_URL ?? "https://seudominio.com";

    const urls = [
      `<url><loc>${base}/</loc><changefreq>weekly</changefreq></url>`,
      ...slugs.map(
        (s) => `<url><loc>${base}/caracteres/${s}</loc><changefreq>monthly</changefreq></url>`
      ),
    ].join("\n  ");

    res.header("Content-Type", "application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`);
  } catch (err) {
    res.status(500).send("Erro");
  }
});

// SPA fallback — tudo que não for rota conhecida vai para o React
app.get("*", (_req, res) => {
  if (isDev) {
    res.redirect("http://localhost:5173" + _req.path);
  } else {
    res.sendFile(path.join(__dirname, "../client/index.html"));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`   Modo: ${isDev ? "desenvolvimento" : "produção"}`);
});
