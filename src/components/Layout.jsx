// ข้อ 2: layout route — Nav + Outlet + footer (เขียนที่เดียว ใช้ทุกหน้า)
import { Outlet } from 'react-router-dom'
import Nav from './Nav.jsx'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <main className="mx-auto max-w-5xl p-4 sm:p-6">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-5xl px-4 pb-6 text-center text-xs text-gray-400">
        Pokédex Team Builder · ข้อมูลจาก PokéAPI
      </footer>
    </div>
  )
}

export default Layout
