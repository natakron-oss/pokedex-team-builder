// ข้อ 2: ข้อความต้อนรับ + ลิงก์ไป /pokemon + จำนวนสมาชิกทีมตอนนี้
import { Link } from 'react-router-dom'
import { useTeam, MAX_TEAM } from '../context/TeamContext.jsx'

function Home() {
  const { team, count } = useTeam()

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-[#eadfbf] bg-[#fbf4dc] px-6 py-8 sm:px-10 sm:py-10">
        <div className="grid items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <p className="text-xs font-extrabold tracking-[0.18em] text-[#d9513c]">YOUR KANTO JOURNEY STARTS HERE</p>
            <h1 className="mt-3 max-w-lg text-4xl font-black leading-tight text-[#20312b] sm:text-5xl">สร้างทีมที่เป็น<br className="hidden sm:block" />ตำนานของคุณ</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-[#66736b]">เลือก Pokémon จากภูมิภาคคันโต แล้วจัดทีมในแบบที่พร้อมออกผจญภัย</p>
            <Link to="/pokemon" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d9513c] px-5 py-3 text-sm font-extrabold text-white shadow-[0_5px_0_#a93a2d] hover:-translate-y-0.5 hover:bg-[#bd4232]">
              เลือก Pokémon <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="flex min-h-44 items-end justify-center gap-0 sm:min-h-56" aria-label="Bulbasaur, Charmander, Squirtle">
            {[1, 4, 7].map((id, index) => (
              <img
                key={id}
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                alt={['Bulbasaur', 'Charmander', 'Squirtle'][index]}
                className={`relative h-36 w-1/3 max-w-40 object-contain drop-shadow-[0_12px_8px_rgba(32,49,43,0.16)] sm:h-48 ${index === 1 ? 'z-10 h-44 sm:h-56' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl border border-[#e1e8dd] bg-white/75 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-black text-[#20312b]">ทีมปัจจุบัน</h2>
            <span className="text-sm font-extrabold text-[#347b55]">{count}/{MAX_TEAM} ตัว</span>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-2" aria-label={`เลือกแล้ว ${count} จาก ${MAX_TEAM} ตัว`}>
            {Array.from({ length: MAX_TEAM }, (_, index) => (
              <div key={index} className={`h-2.5 rounded-full ${index < count ? 'bg-[#4e9a72]' : 'bg-[#e5eae2]'}`} />
            ))}
          </div>
          <p className="mt-3 text-sm text-[#748077]">
            {team.length ? team.map((member) => member.name).join(' · ') : 'ยังไม่มีสมาชิกในทีม เริ่มเลือก Pokémon ตัวแรกของคุณได้เลย'}
          </p>
        </div>
        <Link to="/team" className="inline-flex items-center justify-center rounded-full border border-[#d7e0d5] px-5 py-2.5 text-sm font-bold text-[#526158] hover:border-[#4e9a72] hover:bg-[#eef7ec] hover:text-[#347b55]">
          ดูทีมของฉัน
        </Link>
      </section>
    </div>
  )
}

export default Home
