import React from 'react'

/**
 * Composant Présentationnel (Dumb) : Bannière d'Erreur
 * Accessible avec role="alert" et bouton de réessai.
 */
export function ErrorBanner({ error, onRetry }) {
  if (!error) return null

  return (
    <div
      role="alert"
      className="mb-8 p-5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          ⚠️
        </span>
        <div>
          <h2 className="font-bold text-sm text-rose-100">Erreur de communication API</h2>
          <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          aria-label="Réessayer la requête"
          className="px-4 py-2 text-xs font-bold text-zinc-950 bg-rose-400 hover:bg-rose-300 rounded-lg shadow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 shrink-0"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}
