import React from 'react'

/**
 * Composant Présentationnel (Dumb) : Squelettes de chargement
 * Affiche une grille d'attente animée avec attributs a11y pour indiquer le chargement.
 */
export function SkeletonGrid({ count = 8 }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      aria-busy="true"
      aria-live="polite"
    >
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-4 animate-pulse flex flex-col space-y-4"
        >
          <div className="w-full h-52 rounded-xl bg-zinc-800/80" />
          <div className="h-5 bg-zinc-800 rounded-md w-3/4" />
          <div className="flex gap-2">
            <div className="h-4 bg-zinc-800 rounded-md w-16" />
            <div className="h-4 bg-zinc-800 rounded-md w-24" />
          </div>
          <div className="pt-2 flex justify-between items-center">
            <div className="h-4 bg-zinc-800 rounded-md w-20" />
            <div className="h-8 bg-zinc-800 rounded-lg w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
