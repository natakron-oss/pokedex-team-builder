// ข้อ 2: ข้อความต้อนรับ + ลิงก์ไป /pokemon + จำนวนสมาชิกทีมตอนนี้
import { Link } from 'react-router-dom'
import { useTeam, MAX_TEAM } from '../context/TeamContext.jsx'

function Home() {
  const { count } = useTeam()

  return (
    <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
      <h1 className="text-3xl font-bold">Pokédex Team Builder</h1>
      <p className="mt-2 text-gray-600">เลือก Pokémon รุ่นแรก (#1–#151) เข้าทีมได้สูงสุด 6 ตัว</p>
      <p className="mt-4 text-lg">
        ตอนนี้ทีมมี <b className="text-red-600">{count}/{MAX_TEAM}</b> ตัว
      </p>
      <Link
        to="/pokemon"
        className="mt-6 inline-block rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
      >
        ไปหน้ารายการ
      </Link>
    </div>
  )
}

export default Home
