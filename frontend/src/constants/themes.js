/**
 * Palettes graphiques cinématographiques par genre
 * Utilisées par les composants de présentation pour styliser les affiches procédurales.
 */
export const GENRE_THEMES = {
  'Science-fiction': {
    gradient: 'from-cyan-950 via-slate-900 to-indigo-950',
    border: 'border-cyan-500/30',
    accent: 'text-cyan-400',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    icon: '🚀',
  },
  'Action': {
    gradient: 'from-amber-950 via-zinc-900 to-red-950',
    border: 'border-amber-500/30',
    accent: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    icon: '💥',
  },
  'Drame': {
    gradient: 'from-purple-950 via-zinc-900 to-slate-950',
    border: 'border-purple-500/30',
    accent: 'text-purple-400',
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    icon: '🎭',
  },
  'Thriller': {
    gradient: 'from-emerald-950 via-zinc-900 to-stone-950',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    icon: '🔪',
  },
  'Policier': {
    gradient: 'from-blue-950 via-slate-900 to-zinc-950',
    border: 'border-blue-500/30',
    accent: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    icon: '🔍',
  },
  'Comédie': {
    gradient: 'from-yellow-950 via-stone-900 to-amber-950',
    border: 'border-yellow-500/30',
    accent: 'text-yellow-400',
    badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    icon: '🎉',
  },
  'Aventure': {
    gradient: 'from-emerald-950 via-zinc-900 to-teal-950',
    border: 'border-teal-500/30',
    accent: 'text-teal-400',
    badge: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    icon: '🗺️',
  },
  'Romance': {
    gradient: 'from-rose-950 via-zinc-900 to-pink-950',
    border: 'border-rose-500/30',
    accent: 'text-rose-400',
    badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    icon: '❤️',
  },
  'Guerre': {
    gradient: 'from-stone-950 via-neutral-900 to-amber-950',
    border: 'border-stone-500/30',
    accent: 'text-stone-300',
    badge: 'bg-stone-500/10 text-stone-300 border-stone-500/30',
    icon: '🎖️',
  },
}

export function getGenreTheme(genre) {
  return (
    GENRE_THEMES[genre] || {
      gradient: 'from-zinc-900 via-neutral-900 to-stone-900',
      border: 'border-zinc-700/50',
      accent: 'text-amber-400',
      badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
      icon: '🎬',
    }
  )
}
