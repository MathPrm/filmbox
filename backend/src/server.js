import express from 'express';
import cors from 'cors';
import { query } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/movies/top', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT f.id, f.titre, f.annee, ROUND(AVG(n.note), 2) AS moyenne, COUNT(n.note) AS nb_notes
      FROM films f
      JOIN notes n ON n.film_id = f.id
      GROUP BY f.id, f.titre, f.annee
      HAVING COUNT(n.note) >= 5
      ORDER BY moyenne DESC, nb_notes DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/active', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT u.pseudo, COUNT(j.id) AS nb_visionnages, COUNT(DISTINCT j.film_id) AS nb_films_distincts
      FROM utilisateurs u
      LEFT JOIN journal j ON j.utilisateur_id = u.id
      GROUP BY u.id, u.pseudo
      ORDER BY nb_visionnages DESC, nb_films_distincts DESC;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/movies/catalog', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT 
        v.id, 
        v.titre, 
        v.annee, 
        v.genre, 
        v.moyenne_classique, 
        v.nb_votes,
        calculer_score_imdb(v.id) AS score_pondere
      FROM vue_catalogue_films v
      WHERE v.nb_votes > 0
      ORDER BY score_pondere DESC
      LIMIT 20;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// M12 : Recherche de films optimisée par l'Index Trigramme
app.get('/api/movies/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json([]);
  }

  try {
    const { rows } = await query(`
      SELECT id, titre, annee, genre 
      FROM films 
      WHERE titre ILIKE $1 
      ORDER BY annee DESC
    `, [`%${q}%`]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));