// R3: อ่าน nameOrId จาก useParams · ธาตุ · ม./กก. · เพิ่ม/เอาออกจากทีม · ก่อนหน้า/ถัดไป · นอก #1–#151 = ไม่อยู่ใน Pokédex นี้
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch.js'
import { useTeam, MAX_TEAM } from '../context/TeamContext.jsx'
import { API, MAX_ID, artworkUrl } from '../lib/pokemon.js'

function PokemonDetail() {
  const { nameOrId } = useParams()
  const key = String(nameOrId ?? '').toLowerCase()

  // รับได้ทั้งชื่อและ id — /pokemon/25 กับ /pokemon/pikachu ได้หน้าเดียวกัน (Twist 4)
  const { data, loading, error } = useFetch(`${API}/pokemon/${key}`)
  const { team, add, remove, has, isFull } = useTeam()

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e1e8dd] bg-white/75 p-6 text-[#6f7b72]">
        <p>กำลังโหลด…</p>
      </div>
    )
  }

  if (error) {
    // ชื่อมั่ว (/pokemon/notapokemon) → "ไม่พบ" ไม่ใช่จอขาว/loading ค้าง (Twist 4)
    return (
      <div className="rounded-2xl border border-[#e1e8dd] bg-white/80 p-8 text-center">
        <p className="text-2xl font-black text-[#20312b]">ไม่พบ Pokémon</p>
        <p className="mt-2 text-[#6f7b72]">ไม่มีชื่อหรือ id “{nameOrId}” ใน PokéAPI</p>
        <Link to="/pokemon" className="mt-6 inline-block rounded-full bg-[#d9513c] px-5 py-2.5 font-bold text-white hover:bg-[#bd4232]">
          กลับหน้ารายการ
        </Link>
      </div>
    )
  }

  if (!data) return null

  // มีจริงใน API แต่อยู่นอก #1–#151 (เช่น /pokemon/152, /pokemon/chikorita) → ไม่อยู่ใน Pokédex นี้ (Twist 3)
  if (data.id < 1 || data.id > MAX_ID) {
    return (
      <div className="rounded-2xl border border-[#e1e8dd] bg-white/80 p-8 text-center">
        <p className="text-2xl font-black text-[#20312b]">#{data.id} {data.name} ไม่อยู่ใน Pokédex นี้</p>
        <p className="mt-2 text-[#6f7b72]">Pokédex นี้มีเฉพาะ #1–#{MAX_ID} เท่านั้น</p>
        <Link to="/pokemon" className="mt-6 inline-block rounded-full bg-[#d9513c] px-5 py-2.5 font-bold text-white hover:bg-[#bd4232]">
          กลับหน้ารายการ
        </Link>
      </div>
    )
  }

  const inTeam = has(data.id)
  const heightM = (data.height / 10).toFixed(1) // API ให้มาเป็นเดซิเมตร
  const weightKg = (data.weight / 10).toFixed(1) // API ให้มาเป็นเฮกโตกรัม

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e1e8dd] bg-white/80 p-5 shadow-[0_12px_32px_rgba(32,49,43,0.07)] sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row">
        <img
          src={artworkUrl(data.id)}
          alt={data.name}
          className="mx-auto h-52 w-52 rounded-2xl bg-[#f0f5eb] object-contain p-2 drop-shadow-sm sm:h-64 sm:w-64"
        />
        <div className="flex-1">
          <p className="text-xs font-extrabold tracking-widest text-[#89958c]">NO. {String(data.id).padStart(3, '0')}</p>
          <h1 className="mt-1 text-4xl font-black capitalize text-[#20312b]">{data.name}</h1>
          <div className="mt-3 flex gap-2">
            {data.types.map((t) => (
              <span key={t.type.name} className="rounded-full bg-[#edf2e9] px-3 py-1 text-sm font-bold capitalize text-[#536158]">
                {t.type.name}
              </span>
            ))}
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-sm text-[#7c887f]">ส่วนสูง</dt>
              <dd className="font-semibold">{heightM} ม.</dd>
            </div>
            <div>
              <dt className="text-sm text-[#7c887f]">น้ำหนัก</dt>
              <dd className="font-semibold">{weightKg} กก.</dd>
            </div>
          </dl>

          {inTeam ? (
            <button
              onClick={() => remove(data.id)}
              className="mt-6 rounded-full border border-[#e8cbc4] px-5 py-2.5 font-bold text-[#c64d3c] hover:bg-[#fff0ed]"
            >
              เอาออกจากทีม
            </button>
          ) : (
            <>
              <button
                onClick={() => add({ id: data.id, name: data.name })}
                disabled={isFull}
                title={isFull ? `ทีมเต็มแล้ว (${team.length}/${MAX_TEAM})` : 'เพิ่มเข้าทีม'}
                className={`mt-6 rounded-full px-5 py-2.5 font-bold text-white ${
                  isFull ? 'cursor-not-allowed bg-[#b9c2ba]' : 'bg-[#d9513c] hover:bg-[#bd4232]'
                }`}
              >
                เพิ่มเข้าทีม
              </button>
              {isFull && (
                <p className="mt-2 text-sm text-[#6f7b72]">ทีมเต็มแล้ว ({team.length}/{MAX_TEAM}) — เอาตัวอื่นออกก่อน</p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[#e1e8dd] pt-4 text-sm font-bold">
        {data.id > 1 ? (
          <Link to={`/pokemon/${data.id - 1}`} className="text-[#d9513c] hover:text-[#a93a2d]">← #{data.id - 1}</Link>
        ) : (
          <span />
        )}
        <Link to="/pokemon" className="text-[#748077] hover:text-[#20312b]">กลับหน้ารายการ</Link>
        {data.id < MAX_ID ? (
          <Link to={`/pokemon/${data.id + 1}`} className="text-[#d9513c] hover:text-[#a93a2d]">#{data.id + 1} →</Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}

export default PokemonDetail
