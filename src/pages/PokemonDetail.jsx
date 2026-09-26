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
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-gray-500">กำลังโหลด…</p>
      </div>
    )
  }

  if (error) {
    // ชื่อมั่ว (/pokemon/notapokemon) → "ไม่พบ" ไม่ใช่จอขาว/loading ค้าง (Twist 4)
    return (
      <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
        <p className="text-2xl font-bold">ไม่พบ Pokémon</p>
        <p className="mt-2 text-gray-500">ไม่มีชื่อหรือ id “{nameOrId}” ใน PokéAPI</p>
        <Link to="/pokemon" className="mt-6 inline-block rounded-md bg-red-600 px-4 py-2 font-semibold text-white">
          กลับหน้ารายการ
        </Link>
      </div>
    )
  }

  if (!data) return null

  // มีจริงใน API แต่อยู่นอก #1–#151 (เช่น /pokemon/152, /pokemon/chikorita) → ไม่อยู่ใน Pokédex นี้ (Twist 3)
  if (data.id < 1 || data.id > MAX_ID) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
        <p className="text-2xl font-bold">#{data.id} {data.name} ไม่อยู่ใน Pokédex นี้</p>
        <p className="mt-2 text-gray-500">Pokédex นี้มีเฉพาะ #1–#{MAX_ID} เท่านั้น</p>
        <Link to="/pokemon" className="mt-6 inline-block rounded-md bg-red-600 px-4 py-2 font-semibold text-white">
          กลับหน้ารายการ
        </Link>
      </div>
    )
  }

  const inTeam = has(data.id)
  const heightM = (data.height / 10).toFixed(1) // API ให้มาเป็นเดซิเมตร
  const weightKg = (data.weight / 10).toFixed(1) // API ให้มาเป็นเฮกโตกรัม

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row">
        <img
          src={artworkUrl(data.id)}
          alt={data.name}
          className="mx-auto h-48 w-48 object-contain"
        />
        <div className="flex-1">
          <p className="text-sm text-gray-400">#{String(data.id).padStart(3, '0')}</p>
          <h1 className="text-3xl font-bold capitalize">{data.name}</h1>
          <div className="mt-3 flex gap-2">
            {data.types.map((t) => (
              <span key={t.type.name} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                {t.type.name}
              </span>
            ))}
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-gray-500">ส่วนสูง</dt>
              <dd className="font-semibold">{heightM} ม.</dd>
            </div>
            <div>
              <dt className="text-gray-500">น้ำหนัก</dt>
              <dd className="font-semibold">{weightKg} กก.</dd>
            </div>
          </dl>

          {inTeam ? (
            <button
              onClick={() => remove(data.id)}
              className="mt-6 rounded-md border border-red-600 px-4 py-2 font-semibold text-red-600"
            >
              เอาออกจากทีม
            </button>
          ) : (
            <>
              <button
                onClick={() => add({ id: data.id, name: data.name })}
                disabled={isFull}
                title={isFull ? `ทีมเต็มแล้ว (${team.length}/${MAX_TEAM})` : 'เพิ่มเข้าทีม'}
                className={`mt-6 rounded-md px-4 py-2 font-semibold text-white ${
                  isFull ? 'cursor-not-allowed bg-gray-300' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                เพิ่มเข้าทีม
              </button>
              {isFull && (
                <p className="mt-2 text-sm text-gray-500">ทีมเต็มแล้ว ({team.length}/{MAX_TEAM}) — เอาตัวอื่นออกก่อน</p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-4 text-sm">
        {data.id > 1 ? (
          <Link to={`/pokemon/${data.id - 1}`} className="text-red-600">← #{data.id - 1}</Link>
        ) : (
          <span />
        )}
        <Link to="/pokemon" className="text-gray-500">กลับหน้ารายการ</Link>
        {data.id < MAX_ID ? (
          <Link to={`/pokemon/${data.id + 1}`} className="text-red-600">#{data.id + 1} →</Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}

export default PokemonDetail
