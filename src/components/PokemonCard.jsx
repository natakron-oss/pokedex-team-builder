// R7: การ์ดรูป + #id + ชื่อ + ป้าย "อยู่ในทีม" · ใช้ซ้ำทั้งหน้า /pokemon และ /team
import { Link } from 'react-router-dom'
import { useTeam } from '../context/TeamContext.jsx'
import { artworkUrl } from '../lib/pokemon.js'

function PokemonCard({ id, name, children }) {
  const { has } = useTeam()
  const inTeam = has(id)

  return (
    <div className="flex flex-col rounded-lg border bg-white p-3 shadow-sm">
      <Link to={`/pokemon/${id}`} className="relative block">
        <img
          src={artworkUrl(id)}
          alt={name}
          loading="lazy"
          className="mx-auto h-28 w-28 object-contain"
        />
        {inTeam && (
          <span className="absolute right-0 top-0 rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
            อยู่ในทีม
          </span>
        )}
      </Link>
      <p className="mt-2 text-xs text-gray-400">#{String(id).padStart(3, '0')}</p>
      <Link to={`/pokemon/${id}`} className="font-semibold capitalize hover:text-red-600">
        {name}
      </Link>
      {children}
    </div>
  )
}

export default PokemonCard
