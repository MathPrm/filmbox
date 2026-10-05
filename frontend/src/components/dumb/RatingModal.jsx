import React, { useState, useEffect, useRef } from 'react'

/**
 * Composant Présentationnel (Dumb) : Dialogue Modal de Notation
 * Offre une sélection 0.5 à 5.0 (Letterboxd) avec gestion clavier et a11y.
 */
export function RatingModal({
  movie,
  currentRating,
  isOpen,
  onClose,
  onRateSubmit,
  isSubmitting,
}) {
  const [selectedNote, setSelectedNote] = useState(currentRating || 4.0)
  const [hoverNote, setHoverNote] = useState(null)
  const modalRef = useRef(null)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      modalRef.current?.focus()
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !movie) return null

  const displayNote = hoverNote !== null ? hoverNote : selectedNote
  const ratingSteps = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]

  const getAppreciation = (note) => {
    if (note >= 5.0) return "Chef-d'œuvre absolu"
    if (note >= 4.5) return 'Exceptionnel'
    if (note >= 4.0) return 'Très bon film'
    if (note >= 3.5) return 'Bon film'
    if (note >= 3.0) return 'Pas mal'
    if (note >= 2.5) return 'Moyen'
    if (note >= 2.0) return 'Décevant'
    return 'Médiocre'
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex="-1"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700/80 p-6 shadow-2xl text-zinc-100 flex flex-col space-y-5 focus-visible:outline-none"
      >
        {/* En-tête du modal */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">
              Journal FilmBox
            </span>
            <h3 id="rating-modal-title" className="text-xl font-bold text-zinc-50 mt-0.5">
              Noter {movie.titre}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {movie.annee} • {movie.genre}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre de notation"
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            ✕
          </button>
        </div>

        {/* Note numérique & appréciation */}
        <div className="flex flex-col items-center justify-center py-4 bg-zinc-950/70 rounded-xl border border-zinc-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-amber-400 tracking-tight">
              {displayNote.toFixed(1)}
            </span>
            <span className="text-zinc-500 font-medium">/ 5.0</span>
          </div>
          <span className="text-xs font-medium text-amber-300/80 mt-1">
            {getAppreciation(displayNote)}
          </span>
        </div>

        {/* Sélecteur de note par paliers de 0.5 */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            Sélectionnez votre note (échelle Letterboxd) :
          </label>
          <div
            className="grid grid-cols-5 gap-1.5 sm:gap-2"
            role="group"
            aria-label="Choix de la note par demi-étoile"
          >
            {ratingSteps.map((step) => {
              const isSelected = selectedNote === step
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setSelectedNote(step)}
                  onMouseEnter={() => setHoverNote(step)}
                  onMouseLeave={() => setHoverNote(null)}
                  aria-label={`Attribuer la note de ${step} sur 5`}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all border ${
                    isSelected
                      ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-md shadow-amber-400/20'
                      : 'bg-zinc-800/70 text-zinc-300 border-zinc-700/60 hover:bg-zinc-700 hover:text-white'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400`}
                >
                  ★ {step}
                </button>
              )
            })}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            aria-label="Annuler la notation"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onRateSubmit(movie.id, selectedNote)}
            aria-label={`Confirmer la note de ${selectedNote} sur 5 pour ${movie.titre}`}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg shadow-lg shadow-amber-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-950"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Enregistrement...
              </>
            ) : (
              'Enregistrer la note'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
