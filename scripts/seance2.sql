-- =====================================================================
-- Séance 2 : Missions M7 à M10 (Corrigé avec structure exacte)
-- =====================================================================

-- M7 : Préparation de la colonne JSONB et données de test
ALTER TABLE films ADD COLUMN IF NOT EXISTS metadata JSONB;
UPDATE films SET metadata = '{"langue_originale": "en", "budget": 160000000}' WHERE titre = 'Inception';
UPDATE films SET metadata = '{"langue_originale": "en", "budget": 185000000}' WHERE titre = 'The Dark Knight';

-- M7 : Extraction de données depuis un champ JSONB
SELECT 
    titre, 
    metadata->>'langue_originale' AS langue,
    CAST(metadata->>'budget' AS INTEGER) AS budget
FROM films 
WHERE metadata ? 'budget'
ORDER BY budget DESC NULLS LAST;

-- M8 : Création d'une Vue classique pour le catalogue
CREATE OR REPLACE VIEW vue_catalogue_films AS
SELECT 
    f.id, 
    f.titre, 
    f.annee, 
    f.genre,
    ROUND(AVG(n.note), 2) AS moyenne_classique,
    COUNT(n.note) AS nb_votes
FROM films f
LEFT JOIN notes n ON f.id = n.film_id
GROUP BY f.id, f.titre, f.annee, f.genre;

-- M9 : Création d'une Vue Matérialisée pour les statistiques membres
DROP MATERIALIZED VIEW IF EXISTS mv_statistiques_membres;
CREATE MATERIALIZED VIEW mv_statistiques_membres AS
SELECT 
    u.id, 
    u.pseudo, 
    COUNT(DISTINCT n.film_id) AS total_notes_donnees,
    COUNT(DISTINCT j.film_id) AS total_films_vus
FROM utilisateurs u
LEFT JOIN notes n ON u.id = n.utilisateur_id
LEFT JOIN journal j ON u.id = j.utilisateur_id
GROUP BY u.id, u.pseudo;

-- M10 : Fonction PL/pgSQL (Calcul du score pondéré type IMDB/Letterboxd)
CREATE OR REPLACE FUNCTION calculer_score_imdb(id_film INTEGER) 
RETURNS NUMERIC AS $$
DECLARE
    v NUMERIC;          
    m NUMERIC := 5.0;   
    R NUMERIC;          
    C NUMERIC;          
    score NUMERIC;
BEGIN
    SELECT COUNT(*), COALESCE(AVG(note), 0) INTO v, R 
    FROM notes WHERE film_id = id_film;

    SELECT AVG(note) INTO C FROM notes;

    IF v = 0 THEN
        RETURN 0; 
    END IF;

    score := (v / (v + m)) * R + (m / (v + m)) * C;
    
    RETURN ROUND(score, 2);
END;
$$ LANGUAGE plpgsql;