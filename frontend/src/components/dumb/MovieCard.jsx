import React, { useMemo } from 'react'
import { getGenreTheme } from '../../constants/themes.js'
import { StarIcon } from './StarIcon.jsx'

/**
 * Composant Présentationnel (Dumb) : Carte de Film Cinématographique
 * Entièrement piloté par les props reçues.
 */
export function MovieCard({ movie, userRating, onOpenRate }) {
  const theme = getGenreTheme(movie.genre)

  // Normalisation du score affiché
  const scoreDisplay = useMemo(() => {
    if (movie.score_pondere !== undefined && movie.score_pondere !== null) {
      const num = Number(movie.score_pondere)
      return !isNaN(num) ? num.toFixed(1) : null
    }
    if (movie.moyenne !== undefined && movie.moyenne !== null) {
      const num = Number(movie.moyenne)
      return !isNaN(num) ? num.toFixed(1) : null
    }
    if (movie.moyenne_classique !== undefined && movie.moyenne_classique !== null) {
      const num = Number(movie.moyenne_classique)
      return !isNaN(num) ? num.toFixed(1) : null
    }
    return null
  }, [movie])

  return (
    <article
      aria-labelledby={`movie-title-${movie.id}`}
      className="group relative rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 shadow-lg hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Affiche cinématographique stylisée procédurale */}
      <div
        className={`relative w-full aspect-[16/10] bg-gradient-to-br ${theme.gradient} p-4 flex flex-col justify-between overflow-hidden border-b border-zinc-800/80`}
      >
        {/* Motif perforations pellicule 35mm (haut) */}
        <div className="absolute top-1 left-2 right-2 flex justify-between opacity-20 pointer-events-none" aria-hidden="true">
          {[...Array(9)].map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-sm bg-zinc-300 inline-block" />
          ))}
        </div>

        {/* Badges Année et Genre */}
        <div className="relative z-10 flex items-center justify-between gap-2 mt-1">
          <span className="text-[11px] font-mono tracking-wider font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-zinc-300 border border-zinc-700/60">
            {movie.annee}
          </span>
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${theme.badge}`}
          >
            {theme.icon} {movie.genre}
          </span>
        </div>

        {/* Filigrane et Icône centrale */}
        <div className="relative z-10 my-auto text-center transform transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
          <span className="text-4xl block opacity-75 drop-shadow-md select-none">
            {theme.icon}
          </span>
        </div>

        {/* Motif perforations pellicule 35mm (bas) */}
        <div className="absolute bottom-1 left-2 right-2 flex justify-between opacity-20 pointer-events-none" aria-hidden="true">
          {[...Array(9)].map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-sm bg-zinc-300 inline-block" />
          ))}
        </div>
      </div>

      {/* Détails du film */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3
            id={`movie-title-${movie.id}`}
            className="text-base font-bold text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-1"
            title={movie.titre}
          >
            {movie.titre}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
            <span>Film #{movie.id}</span>
            {movie.nb_votes !== undefined && (
              <>
                <span aria-hidden="true">•</span>
                <span>{movie.nb_votes} avis</span>
              </>
            )}
            {movie.nb_notes !== undefined && (
              <>
                <span aria-hidden="true">•</span>
                <span>{movie.nb_notes} notes</span>
              </>
            )}
          </p>
        </div>

        {/* Score & Bouton d'action pour noter */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5" title="Score FilmBox">
            <StarIcon filled={true} className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-amber-400">
              {scoreDisplay ? `${scoreDisplay}` : '—'}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">/ 5</span>
          </div>

          <button
            type="button"
            onClick={() => onOpenRate(movie)}
            aria-label={`Noter le film ${movie.titre}`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              userRating
                ? 'bg-amber-400/10 text-amber-300 border border-amber-400/40 hover:bg-amber-400/20'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700/60'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400`}
          >
            <StarIcon
              filled={Boolean(userRating)}
              className={`w-3.5 h-3.5 ${userRating ? 'text-amber-400 fill-amber-400' : 'text-zinc-400'}`}
            />
            <span>{userRating ? `Noté ${userRating}★` : 'Noter'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
