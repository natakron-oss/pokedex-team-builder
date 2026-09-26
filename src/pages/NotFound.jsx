// ข้อ 2: 404 + ปุ่มกลับหน้าแรก
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
      <p className="text-5xl font-bold text-gray-300">404</p>
      <h1 className="mt-2 text-xl font-semibold">ไม่พบหน้านี้</h1>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-red-600 px-4 py-2 font-semibold text-white"
      >
        กลับหน้าแรก
      </Link>
    </div>
  )
}

export default NotFound
