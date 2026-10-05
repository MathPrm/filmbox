import React from 'react'

/**
 * Composant Présentationnel (Dumb) : Table des Membres Actifs (Journal/Activité)
 */
export function ActiveUsersTable({ users = [] }) {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
        <p className="text-zinc-400 text-sm">Aucun membre répertorié pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
      <table className="w-full text-left text-sm text-zinc-200">
        <thead className="bg-zinc-950/80 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
          <tr>
            <th scope="col" className="px-6 py-4">
              Cinéphile
            </th>
            <th scope="col" className="px-6 py-4 text-center">
              Visionnages au Journal
            </th>
            <th scope="col" className="px-6 py-4 text-center">
              Films Distincts Vus
            </th>
            <th scope="col" className="px-6 py-4 text-right">
              Statut
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {users.map((user, idx) => (
            <tr
              key={user.pseudo || idx}
              className="hover:bg-zinc-800/40 transition-colors"
            >
              <td className="px-6 py-4 font-semibold text-zinc-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold text-xs">
                  {user.pseudo?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span>@{user.pseudo}</span>
              </td>
              <td className="px-6 py-4 text-center font-mono text-amber-400 font-bold">
                {user.nb_visionnages}
              </td>
              <td className="px-6 py-4 text-center font-mono text-zinc-300">
                {user.nb_films_distincts}
              </td>
              <td className="px-6 py-4 text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Actif
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
