import React from 'react'

/**
 * Composant Présentationnel (Dumb) : Filtres par Genre
 * Permet de basculer entre les genres disponibles.
 */
export function GenreFilter({ genres, selectedGenre, onSelectGenre }) {
  if (!genres || genres.length <= 2) return null

  return (
    <nav
      aria-label="Filtrer les films par genre"
      className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none"
    >
      <span className="text-xs font-medium text-zinc-400 shrink-0 mr-1 select-none">
        Genres :
      </span>
      {genres.map((genre) => {
        const isActive = selectedGenre === genre
        return (
          <button
            key={genre}
            type="button"
            onClick={() => onSelectGenre(genre)}
            aria-pressed={isActive}
            aria-label={`Filtrer par le genre ${genre}`}
            className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 transition-all border ${
              isActive
                ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-sm'
                : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400`}
          >
            {genre}
          </button>
        )
      })}
    </nav>
  )
}
