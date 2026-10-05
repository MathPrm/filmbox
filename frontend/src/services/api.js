/**
 * Service API pour FilmBox
 * Centralise les appels réseau avec gestion des erreurs et injection de configuration sécurisée.
 * Aucun secret en dur : configuration via variables d'environnement Vite.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Helper générique d'exécution de requête HTTP avec gestion d'erreurs
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  let response

  try {
    response = await fetch(url, options)
  } catch (networkError) {
    if (networkError.name === 'AbortError') {
      throw networkError
    }
    throw new Error(
      `Impossible de joindre le serveur FilmBox (${url}). Vérifiez que le backend Express est démarré.`
    )
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.error || `Erreur serveur HTTP ${response.status} sur l'endpoint ${endpoint}`
    )
  }

  return data
}

export const api = {
  /**
   * Récupère le catalogue des films (Top 20 ordonné par score pondéré IMDb)
   */
  getCatalog(signal) {
    return request('/api/movies/catalog', { signal })
  },

  /**
   * Récupère le Top 10 des films selon les notes directes
   */
  getTopMovies(signal) {
    return request('/api/movies/top', { signal })
  },

  /**
   * Récupère la liste des utilisateurs actifs et leurs visionnages
   */
  getActiveUsers(signal) {
    return request('/api/users/active', { signal })
  },

  /**
   * Recherche un film par son titre avec assainissement des entrées
   */
  searchMovies(query, signal) {
    const sanitizedQuery = (query || '').trim()
    if (!sanitizedQuery) {
      return Promise.resolve([])
    }
    return request(`/api/movies/search?q=${encodeURIComponent(sanitizedQuery)}`, { signal })
  },

  /**
   * Enregistre la note et le visionnage d'un film pour un utilisateur donné
   */
  rateMovie({ film_id, note, utilisateur_id = 1 }) {
    return request('/api/movies/rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        utilisateur_id: Number(utilisateur_id),
        film_id: Number(film_id),
        note: Number(note),
      }),
    })
  },
}
