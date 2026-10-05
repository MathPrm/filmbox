-- =====================================================================
-- Séance 5 : Missions M15 à M16 (Sécurité et Concurrence) - CORRIGÉ
-- =====================================================================

-- 0. Préparation de la base (Ce que faisait le fichier filmbox-s5.sql)
ALTER TABLE films ADD COLUMN IF NOT EXISTS nb_vues INTEGER DEFAULT 0;
ALTER TABLE journal ADD COLUMN IF NOT EXISTS prive BOOLEAN DEFAULT FALSE;

-- Simulation d'environ 1 entrée sur 4 en privé
UPDATE journal SET prive = TRUE WHERE id % 4 = 0;

-- M16.1 : Création du rôle applicatif limité
DROP ROLE IF EXISTS filmbox_app;
CREATE ROLE filmbox_app;
GRANT SELECT ON films, utilisateurs, notes, journal TO filmbox_app;
GRANT INSERT, UPDATE ON notes, journal TO filmbox_app;
GRANT USAGE, SELECT ON SEQUENCE journal_id_seq TO filmbox_app;

-- M16.2 : Activation de la Row-Level Security (RLS) sur le journal
ALTER TABLE journal ENABLE ROW LEVEL SECURITY;

-- Nettoyage des anciennes politiques si on relance le script
DROP POLICY IF EXISTS journal_select_policy ON journal;
DROP POLICY IF EXISTS journal_insert_policy ON journal;
DROP POLICY IF EXISTS journal_update_policy ON journal;

-- Lecture : Les entrées publiques ou appartenant au membre connecté (app.membre_id)
CREATE POLICY journal_select_policy ON journal 
FOR SELECT TO filmbox_app 
USING (NOT prive OR utilisateur_id = NULLIF(current_setting('app.membre_id', true), '')::integer);

-- Écriture : Un membre ne peut insérer/modifier que ses propres entrées
CREATE POLICY journal_insert_policy ON journal 
FOR INSERT TO filmbox_app 
WITH CHECK (utilisateur_id = NULLIF(current_setting('app.membre_id', true), '')::integer);

CREATE POLICY journal_update_policy ON journal 
FOR UPDATE TO filmbox_app 
USING (utilisateur_id = NULLIF(current_setting('app.membre_id', true), '')::integer);

-- M16.3 : Fonction de recherche statique anti-injection SQL
CREATE OR REPLACE FUNCTION rechercher_films(texte text)
RETURNS TABLE(titre varchar, annee integer) AS $$
    SELECT f.titre, f.annee 
    FROM films f 
    WHERE f.titre ILIKE '%' || texte || '%' 
    LIMIT 5;
$$ LANGUAGE sql STABLE;