import React from 'react'

/**
 * Composant Présentationnel (Dumb) : Toast Notification
 * Rendu pur d'un message temporaire d'information, accessible pour les lecteurs d'écran.
 */
export function Toast({ toast, onClose }) {
  if (!toast) return null

  const isSuccess = toast.type === 'success'

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md transition-all animate-bounce duration-300 border bg-zinc-900/95 text-zinc-100 border-zinc-700"
    >
      <span
        className={`text-xl font-bold ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}
        aria-hidden="true"
      >
        {isSuccess ? '✓' : '⚠'}
      </span>
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer la notification"
        className="ml-2 text-zinc-400 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded p-1 transition-colors"
      >
        ✕
      </button>
    </div>
  )
}
