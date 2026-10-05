import React from 'react'

/**
 * Composant Présentationnel (Dumb) : Pied de page
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-[#0e1115] py-8 text-zinc-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-300">FilmBox</span>
          <span aria-hidden="true">—</span>
          <span>Réseau social de cinéphiles • Couche Données PostgreSQL</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <span>
            Raccourci clavier : Appuyez sur <kbd className="font-mono bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">/</kbd> pour rechercher
          </span>
        </div>
      </div>
    </footer>
  )
}
