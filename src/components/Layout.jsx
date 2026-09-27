// ข้อ 2: layout route — Nav + Outlet + footer (เขียนที่เดียว ใช้ทุกหน้า)
import { Outlet } from 'react-router-dom'
import Nav from './Nav.jsx'

function Layout() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-8 text-center text-xs font-medium tracking-wide text-[#78847c] sm:px-6">
        POKÉDEX TEAM BUILDER <span className="mx-1 text-[#e15b45]">/</span> ข้อมูลจาก PokéAPI
      </footer>
    </div>
  )
}

export default Layout
