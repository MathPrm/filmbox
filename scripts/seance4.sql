-- =====================================================================
-- Séance 4 : Missions M13 à M14 (Procédures et Triggers)
-- =====================================================================
SET client_encoding = 'UTF8';

-- M13 : Procédure stockée (Ajout d'une note et d'un visionnage en une seule transaction)
CREATE OR REPLACE PROCEDURE ajouter_visionnage_et_note(
    p_utilisateur_id INTEGER,
    p_film_id INTEGER,
    p_note NUMERIC,
    p_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- 1. Ajout ou mise à jour de la note
    INSERT INTO notes (utilisateur_id, film_id, note, note_le)
    VALUES (p_utilisateur_id, p_film_id, p_note, p_date)
    ON CONFLICT (utilisateur_id, film_id) 
    DO UPDATE SET note = EXCLUDED.note, note_le = EXCLUDED.note_le;

    -- 2. Historisation dans le journal de visionnage
    INSERT INTO journal (utilisateur_id, film_id, date_visionnage)
    VALUES (p_utilisateur_id, p_film_id, p_date);
END;
$$;

-- M14 : Trigger d'audit (Trace toutes les modifications sur la table notes)
CREATE TABLE IF NOT EXISTS audit_notes (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER NOT NULL,
    film_id INTEGER NOT NULL,
    ancienne_note NUMERIC(2,1),
    nouvelle_note NUMERIC(2,1),
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(10) NOT NULL
);

CREATE OR REPLACE FUNCTION log_audit_notes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_notes (utilisateur_id, film_id, nouvelle_note, action)
        VALUES (NEW.utilisateur_id, NEW.film_id, NEW.note, 'INSERT');
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_notes (utilisateur_id, film_id, ancienne_note, nouvelle_note, action)
        VALUES (NEW.utilisateur_id, NEW.film_id, OLD.note, NEW.note, 'UPDATE');
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_notes (utilisateur_id, film_id, ancienne_note, action)
        VALUES (OLD.utilisateur_id, OLD.film_id, OLD.note, 'DELETE');
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_notes ON notes;
CREATE TRIGGER trg_audit_notes
AFTER INSERT OR UPDATE OR DELETE ON notes
FOR EACH ROW EXECUTE FUNCTION log_audit_notes();