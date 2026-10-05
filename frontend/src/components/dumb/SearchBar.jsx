import React from 'react'

/**
 * Composant Présentationnel (Dumb) : Barre de Recherche
 * Reçoit la valeur actuelle et les callbacks d'interaction.
 */
export function SearchBar({ value, onChange, onClear, inputRef }) {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="relative flex items-center w-full"
    >
      <label htmlFor="filmbox-search-input" className="sr-only">
        Rechercher un film par titre
      </label>

      {/* Icône de recherche décorative */}
      <div className="absolute left-3.5 pointer-events-none text-zinc-400" aria-hidden="true">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        id="filmbox-search-input"
        ref={inputRef}
        type="search"
        autoComplete="off"
        placeholder="Rechercher un film... (ex: Inception, Batman)"
        aria-label="Rechercher un film par titre"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-20 py-2.5 text-sm rounded-xl bg-zinc-900/90 text-zinc-100 placeholder-zinc-500 border border-zinc-700/80 focus:border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1115] transition-all"
      />

      {/* Bouton d'effacement ou indicateur de raccourci clavier */}
      <div className="absolute right-3 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Effacer la recherche"
            className="p-1 text-zinc-400 hover:text-zinc-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors"
          >
            ✕
          </button>
        ) : (
          <kbd
            aria-hidden="true"
            className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800 border border-zinc-700 rounded shadow-sm select-none"
          >
            /
          </kbd>
        )}
      </div>
    </form>
  )
}
