// R7: การ์ดรูป + #id + ชื่อ + ป้าย "อยู่ในทีม" · ใช้ซ้ำทั้งหน้า /pokemon และ /team
import { Link } from 'react-router-dom'
import { useTeam } from '../context/TeamContext.jsx'
import { artworkUrl } from '../lib/pokemon.js'

function PokemonCard({ id, name, children }) {
  const { has } = useTeam()
  const inTeam = has(id)

  return (
    <article className={`group relative flex flex-col rounded-2xl border-2 p-3 shadow-[0_5px_18px_rgba(32,49,43,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(32,49,43,0.11)] ${
      inTeam
        ? 'border-[#4e9a72] bg-[#eef7ec] ring-2 ring-[#4e9a72]/15'
        : 'border-white/80 bg-white/90 hover:border-[#efc663]'
    }`}>
      <Link to={`/pokemon/${id}`} className={`relative block overflow-hidden rounded-xl ${inTeam ? 'bg-[#dceede]' : 'bg-[#f3f5ee]'}`}>
        <img
          src={artworkUrl(id)}
          alt={name}
          loading="lazy"
          className="mx-auto h-36 w-full object-contain p-2 drop-shadow-sm sm:h-40"
        />
        {inTeam && (
          <span className="absolute right-2 top-2 rounded-full bg-[#347b55] px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm">
            ✓ อยู่ในทีม
          </span>
        )}
      </Link>
      <p className={`mt-3 text-[11px] font-extrabold tracking-widest ${inTeam ? 'text-[#347b55]' : 'text-[#98a198]'}`}>NO. {String(id).padStart(3, '0')}</p>
      <Link to={`/pokemon/${id}`} className="mt-0.5 text-lg font-black capitalize text-[#20312b] group-hover:text-[#d9513c]">
        {name}
      </Link>
      <div className="mt-auto pt-2">{children}</div>
    </article>
  )
}

export default PokemonCard
