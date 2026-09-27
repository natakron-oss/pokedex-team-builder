// ข้อ 2: NavLink หน้าแรก / Pokédex / ทีม (n/6) · active state ถูกต้อง · จำนวนทีมมาจาก useTeam()
import { NavLink } from 'react-router-dom'
import { useTeam } from '../context/TeamContext.jsx'
import { MAX_TEAM } from '../context/TeamContext.jsx'

function linkClass({ isActive }) {
  return `rounded-full px-4 py-2 text-sm font-bold ${
    isActive ? 'bg-[#20312b] text-white shadow-sm' : 'text-[#66736b] hover:bg-[#edf0e9] hover:text-[#20312b]'
  }`
}

function Nav() {
  const { count } = useTeam()

  return (
    <nav className="sticky top-0 z-20 border-b border-[#dfe5dc] bg-[#f8faf6]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <NavLink to="/" end className="flex items-center gap-2.5 font-black tracking-wide text-[#20312b]">
          <span className="grid h-9 w-9 place-items-center rounded-full border-[5px] border-[#e15b45] bg-white shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#20312b]" />
          </span>
          <span className="text-sm sm:text-base">KANTO <span className="text-[#e15b45]">FIELD GUIDE</span></span>
        </NavLink>
        <div className="flex items-center gap-1 rounded-full bg-white/70 p-1 shadow-[inset_0_0_0_1px_#e4e9e1]">
          <NavLink to="/" end className={linkClass}>
            หน้าแรก
          </NavLink>
          <NavLink to="/pokemon" className={linkClass}>
            Pokédex
          </NavLink>
          <NavLink to="/team" className={linkClass}>
            ทีม <span className="ml-1 text-[#efc663]">{count}/{MAX_TEAM}</span>
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Nav
