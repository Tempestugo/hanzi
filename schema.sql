-- ============================================================
-- HANZI BLOG — Schema MySQL (Hostinger hPanel)
-- ============================================================
-- Como rodar:
--   hPanel → Databases → phpMyAdmin → aba SQL → cole e execute
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ------------------------------------------------------------
-- MÓDULOS TEMÁTICOS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS modules (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  order_index INT          NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- CARACTERES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS characters (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hanzi         VARCHAR(10)  NOT NULL UNIQUE,
  pinyin        VARCHAR(50)  NOT NULL,
  tone_number   TINYINT      NOT NULL COMMENT '1=flat 2=rising 3=dip 4=falling',
  meaning_pt    VARCHAR(200) NOT NULL,
  radical       VARCHAR(10)  NOT NULL,
  stroke_count  TINYINT      NOT NULL,
  category      ENUM('pictogram','simple_ideogram','compound_ideogram','phono_semantic','loan') NOT NULL,
  hsk_level     VARCHAR(10)  NULL COMMENT '1-6 ou beyond',
  slug          VARCHAR(100) NOT NULL UNIQUE,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- POSTS (conteúdo editorial de cada caractere)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS character_posts (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  character_id        INT UNSIGNED NOT NULL,
  module_id           INT UNSIGNED NULL,
  title               VARCHAR(300) NOT NULL,
  etymology_content   LONGTEXT     NULL COMMENT 'Markdown',
  evolution_stages    JSON         NULL COMMENT 'Array de {era,label,description,approx_year}',
  composition_notes   TEXT         NULL COMMENT 'Markdown',
  mnemonic            TEXT         NULL,
  example_words       JSON         NULL COMMENT 'Array de {hanzi,pinyin,meaning_pt}',
  published           TINYINT(1)   NOT NULL DEFAULT 0,
  created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id)    REFERENCES modules(id)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- COMPONENTES (relação pai → filho entre caracteres)
-- 木 + 木 = 林
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS character_components (
  id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  parent_id INT UNSIGNED NOT NULL,
  child_id  INT UNSIGNED NOT NULL,
  role      ENUM('semantic','phonetic','both') NOT NULL,
  position  VARCHAR(20) NULL COMMENT 'left, right, top, bottom, radical',

  UNIQUE KEY uq_parent_child (parent_id, child_id),
  FOREIGN KEY (parent_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (child_id)  REFERENCES characters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- ÍNDICES para performance
-- ------------------------------------------------------------
CREATE INDEX idx_characters_category ON characters(category);
CREATE INDEX idx_characters_hsk      ON characters(hsk_level);
CREATE INDEX idx_posts_character     ON character_posts(character_id);
CREATE INDEX idx_posts_module        ON character_posts(module_id);
CREATE INDEX idx_posts_published     ON character_posts(published);
CREATE INDEX idx_components_parent   ON character_components(parent_id);
CREATE INDEX idx_components_child    ON character_components(child_id);
