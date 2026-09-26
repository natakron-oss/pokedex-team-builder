// ข้อ 2: NavLink หน้าแรก / Pokédex / ทีม (n/6) · active state ถูกต้อง · จำนวนทีมมาจาก useTeam()
import { NavLink } from 'react-router-dom'
import { useTeam } from '../context/TeamContext.jsx'
import { MAX_TEAM } from '../context/TeamContext.jsx'

function linkClass({ isActive }) {
  return `rounded-md px-3 py-1.5 text-sm font-medium ${
    isActive ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'
  }`
}

function Nav() {
  const { count } = useTeam()

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
        <NavLink to="/" end className={linkClass}>
          หน้าแรก
        </NavLink>
        <NavLink to="/pokemon" className={linkClass}>
          Pokédex
        </NavLink>
        <NavLink to="/team" className={linkClass}>
          ทีม ({count}/{MAX_TEAM})
        </NavLink>
      </div>
    </nav>
  )
}

export default Nav
