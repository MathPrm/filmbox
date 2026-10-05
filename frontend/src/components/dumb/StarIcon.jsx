import React from 'react'

/**
 * Composant Présentationnel (Dumb) : Icône Étoile SVG
 * Prend uniquement des props pour le rendu visuel.
 */
export function StarIcon({ filled = false, half = false, className = 'w-4 h-4' }) {
  if (half) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#3f3f46" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          fill="url(#halfStar)"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? '#fbbf24' : 'none'}
      stroke={filled ? '#fbbf24' : '#71717a'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
