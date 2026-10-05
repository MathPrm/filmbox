import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { api } from '../../services/api.js'

// Dumb / Presentational components
import { Header } from '../dumb/Header.jsx'
import { SearchBar } from '../dumb/SearchBar.jsx'
import { GenreFilter } from '../dumb/GenreFilter.jsx'
import { MovieGrid } from '../dumb/MovieGrid.jsx'
import { SkeletonGrid } from '../dumb/SkeletonGrid.jsx'
import { RatingModal } from '../dumb/RatingModal.jsx'
import { ActiveUsersTable } from '../dumb/ActiveUsersTable.jsx'
import { ErrorBanner } from '../dumb/ErrorBanner.jsx'
import { Toast } from '../dumb/Toast.jsx'
import { Footer } from '../dumb/Footer.jsx'

/**
 * Composant Conteneur (Smart Component) : MovieDashboardContainer
 * Gère l'état, les effets de bord, la coordination des appels API,
 * et distribue les données et callbacks aux composants de présentation purs.
 */
export function MovieDashboardContainer() {
  // États de données
  const [activeTab, setActiveTab] = useState('catalog') // 'catalog' | 'top' | 'users'
  const [movies, setMovies] = useState([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  // Recherche & Debounce
  const [searchInput, setSearchInput] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const searchInputRef = useRef(null)

  // Filtre par genre
  const [selectedGenre, setSelectedGenre] = useState('Tous')

  // Notations utilisateur en mémoire { [film_id]: note }
  const [userRatings, setUserRatings] = useState({})
  const [activeRateMovie, setActiveRateMovie] = useState(null)
  const [isSubmittingRate, setIsSubmittingRate] = useState(false)

  // Notification Toast
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4500)
  }, [])

  // 1. Debounce de l'input de recherche (350ms) pour protéger l'API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim())
    }, 350)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Raccourci clavier "/" pour focaliser la recherche
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 2. Récupération des données selon l'onglet actif et la recherche
  useEffect(() => {
    let isCancelled = false
    const controller = new AbortController()

    async function loadData() {
      try {
        if (debouncedQuery) {
          // Si une recherche est en cours, elle prend la priorité
          const searchResults = await api.searchMovies(debouncedQuery, controller.signal)
          if (!isCancelled) {
            setMovies(searchResults || [])
            setError(null)
          }
        } else if (activeTab === 'catalog') {
          const catalog = await api.getCatalog(controller.signal)
          if (!isCancelled) {
            setMovies(catalog || [])
            setError(null)
          }
        } else if (activeTab === 'top') {
          const topList = await api.getTopMovies(controller.signal)
          if (!isCancelled) {
            setMovies(topList || [])
            setError(null)
          }
        } else if (activeTab === 'users') {
          const activeUsers = await api.getActiveUsers(controller.signal)
          if (!isCancelled) {
            setUsers(activeUsers || [])
            setError(null)
          }
        }
      } catch (err) {
        if (!isCancelled && err.name !== 'AbortError') {
          setError(
            err.message || 'Impossible de charger les données. Vérifiez l’accès au serveur.'
          )
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isCancelled = true
      controller.abort()
    }
  }, [debouncedQuery, activeTab, reloadTrigger])

  // 3. Soumission d'une note (POST /api/movies/rate)
  const handleRateSubmit = async (film_id, note) => {
    setIsSubmittingRate(true)
    try {
      await api.rateMovie({ utilisateur_id: 1, film_id, note })
      setUserRatings((prev) => ({ ...prev, [film_id]: note }))
      const ratedMovie = movies.find((m) => m.id === film_id)
      showToast(
        `Note de ${note}/5 enregistrée pour "${ratedMovie?.titre || 'Film'}" !`,
        'success'
      )
      setActiveRateMovie(null)
    } catch (err) {
      showToast(err.message || "Erreur lors de l'enregistrement de la note", 'error')
    } finally {
      setIsSubmittingRate(false)
    }
  }

  // 4. Gestion des filtres et navigation
  const handleSearchChange = (value) => {
    setSearchInput(value)
    setIsLoading(true)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setIsLoading(true)
    searchInputRef.current?.focus()
  }

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId)
    setSearchInput('')
    setSelectedGenre('Tous')
    setIsLoading(true)
  }

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    setReloadTrigger((count) => count + 1)
  }

  // Calcul des genres disponibles
  const availableGenres = useMemo(() => {
    const genres = new Set()
    movies.forEach((m) => {
      if (m.genre) genres.add(m.genre)
    })
    return ['Tous', ...Array.from(genres).sort()]
  }, [movies])

  // Filtrage par genre actif
  const filteredMovies = useMemo(() => {
    if (selectedGenre === 'Tous') return movies
    return movies.filter((m) => m.genre === selectedGenre)
  }, [movies, selectedGenre])

  const isSearchActive = Boolean(debouncedQuery)

  return (
    <div className="min-h-screen bg-[#0e1115] text-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-950">
      {/* Header Sticky avec composition de la SearchBar */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleTabSelect}
        onLogoClick={() => handleTabSelect('catalog')}
      >
        <SearchBar
          value={searchInput}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          inputRef={searchInputRef}
        />
      </Header>

      {/* Contenu principal */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Titre & Informations de Section */}
        <section aria-labelledby="dashboard-title" className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                {isSearchActive
                  ? 'Recherche Globale'
                  : activeTab === 'catalog'
                  ? 'Catalogue Top 20 (Score IMDB)'
                  : activeTab === 'top'
                  ? 'Top 10 Notes Directes'
                  : 'Membres & Journal de Visionnage'}
              </span>
              <h1 id="dashboard-title" className="text-2xl sm:text-3xl font-black text-white mt-1">
                {isSearchActive ? (
                  <>
                    Résultats pour <span className="text-amber-400">"{debouncedQuery}"</span>
                  </>
                ) : activeTab === 'catalog' ? (
                  'Top 20 Films Incontournables'
                ) : activeTab === 'top' ? (
                  'Films les Mieux Notés (≥ 5 avis)'
                ) : (
                  'Classement des Membres les Plus Actifs'
                )}
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                {isSearchActive
                  ? `${filteredMovies.length} film(s) correspondant(s) dans la base de données`
                  : activeTab === 'catalog'
                  ? 'Calculé avec la formule bayésienne IMDb et le jeu de données réel'
                  : activeTab === 'top'
                  ? 'Moyenne arithmétique directe des notes de la communauté FilmBox'
                  : 'Visionnages enregistrés dans la table journal'}
              </p>
            </div>

            {/* Bouton retour si recherche active */}
            {isSearchActive && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Revenir à la vue principale"
                className="self-start md:self-auto px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                ← Quitter la recherche
              </button>
            )}
          </div>

          {/* Filtres par genre (uniquement sur les vues de films) */}
          {activeTab !== 'users' && !isSearchActive && (
            <GenreFilter
              genres={availableGenres}
              selectedGenre={selectedGenre}
              onSelectGenre={setSelectedGenre}
            />
          )}
        </section>

        {/* Bannière d'erreur résiliente */}
        <ErrorBanner error={error} onRetry={handleRetry} />

        {/* Affichage conditionnel selon l'état de chargement et l'onglet */}
        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : activeTab === 'users' && !isSearchActive ? (
          <ActiveUsersTable users={users} />
        ) : (
          <MovieGrid
            movies={filteredMovies}
            userRatings={userRatings}
            onOpenRate={(movie) => setActiveRateMovie(movie)}
            onResetSearch={handleClearSearch}
            isSearchActive={isSearchActive}
            searchQuery={debouncedQuery}
          />
        )}
      </main>

      {/* Modal de notation cinéphile */}
      <RatingModal
        key={activeRateMovie?.id || 'none'}
        movie={activeRateMovie}
        isOpen={Boolean(activeRateMovie)}
        currentRating={activeRateMovie ? userRatings[activeRateMovie.id] : null}
        onClose={() => setActiveRateMovie(null)}
        onRateSubmit={handleRateSubmit}
        isSubmitting={isSubmittingRate}
      />

      {/* Notifications Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer sémantique */}
      <Footer />
    </div>
  )
}
