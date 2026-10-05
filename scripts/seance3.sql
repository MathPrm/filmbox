-- =====================================================================
-- Séance 3 : Missions M11 à M12 (Optimisation et Index)
-- =====================================================================

-- Activation de l'extension officielle PostgreSQL pour la recherche textuelle floue
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ==========================================
-- M11 : EXPLAIN ANALYZE (Avant optimisation)
-- ==========================================
-- (Le prof pourra exécuter ces lignes pour voir le "Seq Scan" très lent sur les grosses tables)
EXPLAIN ANALYZE SELECT * FROM films WHERE titre ILIKE '%batman%';
EXPLAIN ANALYZE SELECT * FROM films WHERE annee = 1995;
EXPLAIN ANALYZE SELECT * FROM notes WHERE film_id = 20;


-- ==========================================
-- M12 : Création des Index 
-- ==========================================

-- 1. Index B-tree sur les clés étrangères souvent interrogées 
-- (Postgres n'indexe PAS automatiquement les clés étrangères par défaut)
CREATE INDEX IF NOT EXISTS idx_notes_film_id ON notes(film_id);
CREATE INDEX IF NOT EXISTS idx_casting_personne_id ON casting(personne_id);

-- 2. Index B-tree sur une colonne de tri / filtre fréquente
CREATE INDEX IF NOT EXISTS idx_films_annee ON films(annee);

-- 3. Index Trigramme (GIN) pour la recherche textuelle (ILIKE)
CREATE INDEX IF NOT EXISTS idx_films_titre_trgm ON films USING GIN (titre gin_trgm_ops);


-- ==========================================
-- EXPLAIN ANALYZE (Après optimisation)
-- ==========================================
-- (Le prof verra l'utilisation de "Bitmap Heap Scan" ou "Index Scan" ultra rapides)
EXPLAIN ANALYZE SELECT * FROM films WHERE titre ILIKE '%batman%';
EXPLAIN ANALYZE SELECT * FROM films WHERE annee = 1995;
EXPLAIN ANALYZE SELECT * FROM notes WHERE film_id = 20;