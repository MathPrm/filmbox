import React from 'react'
import { MovieCard } from './MovieCard.jsx'

/**
 * Composant Présentationnel (Dumb) : Grille de Films ou État Vide
 */
export function MovieGrid({
  movies,
  userRatings,
  onOpenRate,
  onResetSearch,
  isSearchActive,
  searchQuery,
}) {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-20 px-4 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 flex flex-col items-center justify-center space-y-4">
        <span className="text-5xl" aria-hidden="true">
          🎬
        </span>
        <h2 className="text-xl font-bold text-zinc-200">Aucun film trouvé</h2>
        <p className="text-sm text-zinc-400 max-w-sm">
          {isSearchActive
            ? `Aucun titre ne correspond à "${searchQuery}". Essayez un autre mot-clé.`
            : 'Aucun film disponible dans cette sélection.'}
        </p>
        {isSearchActive && (
          <button
            type="button"
            onClick={onResetSearch}
            aria-label="Effacer la recherche et revenir au catalogue"
            className="mt-2 px-4 py-2 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Réinitialiser la recherche
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          userRating={userRatings[movie.id]}
          onOpenRate={onOpenRate}
        />
      ))}
    </div>
  )
}
