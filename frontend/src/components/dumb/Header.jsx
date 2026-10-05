import React from 'react'

/**
 * Composant Présentationnel (Dumb) : En-tête Sticky avec Navigation & Recherche
 */
export function Header({ activeTab, onSelectTab, onLogoClick, children }) {
  const tabs = [
    { id: 'catalog', label: 'Top 20 Catalogue' },
    { id: 'top', label: 'Top Notes Directes' },
    { id: 'users', label: 'Membres Actifs' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0e1115]/90 border-b border-zinc-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Navigation */}
        <div className="flex items-center justify-between w-full md:w-auto gap-6">
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="Retour au catalogue d'accueil FilmBox"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1"
          >
            <div className="flex items-center space-x-1" aria-hidden="true">
              <span className="w-3 h-3 rounded-full bg-amber-400 group-hover:scale-110 transition-transform" />
              <span className="w-3 h-3 rounded-full bg-orange-400 group-hover:scale-110 transition-transform delay-75" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 group-hover:scale-110 transition-transform delay-150" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-wider text-white">
              FILM<span className="text-amber-400">BOX</span>
            </span>
          </button>

          {/* Onglets de navigation principale */}
          <nav aria-label="Navigation principale" className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  aria-pressed={isActive}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-amber-400 shadow-inner'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400`}
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Emplacement pour la barre de recherche (Slot Pattern) */}
        <div className="w-full md:max-w-md">{children}</div>
      </div>
    </header>
  )
}
