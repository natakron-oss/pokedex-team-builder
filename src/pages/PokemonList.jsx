// R1, R2: รายการ 151 ตัว · ค้นหา ?q= · ธาตุ ?type= (useSearchParams) · loading / error / ไม่พบผลลัพธ์
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch.js'
import { useTeam, MAX_TEAM } from '../context/TeamContext.jsx'
import { API, MAX_ID, TYPES, idFromUrl } from '../lib/pokemon.js'
import PokemonCard from '../components/PokemonCard.jsx'

function PokemonList() {
  // R2: คำค้น + ธาตุอยู่ใน URL เท่านั้น — ห้ามเก็บซ้ำใน useState
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const type = searchParams.get('type') ?? ''

  // ยิงครั้งเดียว: รายชื่อทั้ง 151 ตัว
  const list = useFetch(`${API}/pokemon?limit=151`)
  // ยิงเฉพาะตอนเลือกธาตุจริง ๆ (url = null = ไม่ยิง)
  const typeRes = useFetch(type ? `${API}/type/${type}` : null)

  const updateParams = (next) => {
    const p = new URLSearchParams(searchParams)
    if (next.q !== undefined) {
      if (next.q) p.set('q', next.q)
      else p.delete('q')
    }
    if (next.type !== undefined) {
      if (next.type) p.set('type', next.type)
      else p.delete('type')
    }
    // replace: true — พิมพ์หลายตัวอักษรไม่สร้าง history ทีละตัว (Twist 2: back ครั้งเดียวออกจากการค้นหา)
    setSearchParams(p, { replace: true })
  }

  // id ของธาตุที่เลือก (กรองเหลือ ≤ 151 — กัน #155 cyndaquil โผล่ตอนเลือก fire, Twist 3)
  const typeIds = useMemo(() => {
    if (!type) return null
    if (!typeRes.data) return null
    const ids = typeRes.data.pokemon
      .map((e) => idFromUrl(e.pokemon.url))
      .filter((id) => id >= 1 && id <= MAX_ID)
    return new Set(ids)
  }, [type, typeRes.data])

  const results = useMemo(() => {
    if (!list.data) return []
    const needle = q.trim().toLowerCase()
    return list.data.results
      .map((p) => ({ name: p.name, id: idFromUrl(p.url) }))
      .filter((p) => p.id >= 1 && p.id <= MAX_ID)
      .filter((p) => !needle || p.name.toLowerCase().includes(needle))
      .filter((p) => !type || (typeIds && typeIds.has(p.id)))
  }, [list.data, q, type, typeIds])

  const { add, remove, has, count, isFull } = useTeam()

  const loading = list.loading || (type && typeRes.loading)
  const error = list.error || (type ? typeRes.error : null)
  // เลือกธาตุแล้วยังโหลดรายชื่อธาตุไม่เสร็จ → ยังกรองไม่ได้ ถือว่า loading
  const waitingType = Boolean(type && !typeRes.data && !typeRes.error)

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-[#d9513c]">KANTO REGION · GEN 01</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-[#20312b] sm:text-4xl">สำรวจ Pokédex</h1>
          <p className="mt-2 text-sm text-[#6f7b72]">เลือกสมาชิกที่ใช่ แล้วประกอบทีมในแบบของคุณ</p>
        </div>
        <div className="rounded-xl border border-[#e1e8dd] bg-white/75 px-4 py-3 text-sm font-bold text-[#526158]">
          ทีมของคุณ <span className="ml-2 text-[#347b55]">{count}/6 ตัว</span>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-[#e1e8dd] bg-white/80 p-3 shadow-sm sm:flex-row">
        <input
          value={q}
          onChange={(e) => updateParams({ q: e.target.value })}
          placeholder="ค้นหาชื่อ เช่น char"
          aria-label="ค้นหา Pokémon"
          className="min-w-0 flex-1 rounded-xl border border-[#e1e8dd] bg-[#f8faf6] px-4 py-3 text-sm outline-none placeholder:text-[#9aa49b] focus:border-[#4e9a72] focus:bg-white"
        />
        <select
          value={type}
          onChange={(e) => updateParams({ type: e.target.value })}
          aria-label="กรองตามธาตุ"
          className="rounded-xl border border-[#e1e8dd] bg-[#f8faf6] px-4 py-3 text-sm font-semibold capitalize text-[#46564c] outline-none focus:border-[#4e9a72]"
        >
          {TYPES.map((t) => (
            <option key={t || 'all'} value={t}>
              {t || 'ทั้งหมด'}
            </option>
          ))}
        </select>
      </div>

      {loading || waitingType ? (
        <p className="mt-6 text-gray-500">กำลังโหลด…</p>
      ) : error ? (
        <div className="mt-6">
          <p className="text-red-600">โหลดไม่สำเร็จ: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-md border px-3 py-1.5 text-sm"
          >
            ลองใหม่
          </button>
        </div>
      ) : results.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-[#ccd7ca] bg-white/50 p-10 text-center font-semibold text-[#6f7b72]">ไม่พบ Pokémon ที่ตรงกับการค้นหา</p>
      ) : (
        <>
          <p className="mt-6 text-xs font-bold tracking-wide text-[#77847a]">แสดงผล {results.length} ตัว <span className="ml-2 text-[#a2aaa1]">·</span> <span className="ml-2">กดการ์ดเพื่อดูรายละเอียด</span></p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {results.map((p) => {
              const inTeam = has(p.id)
              return (
                <PokemonCard key={p.id} id={p.id} name={p.name}>
                  {inTeam ? (
                    <button
                      onClick={() => remove(p.id)}
                      aria-pressed="true"
                      className="w-full rounded-xl border border-[#4e9a72] bg-white px-2 py-2 text-sm font-bold text-[#347b55] hover:bg-[#e1f0e0]"
                    >
                      เอาออกจากทีม
                    </button>
                  ) : (
                    <button
                      onClick={() => add(p)}
                      disabled={isFull}
                      title={isFull ? `ทีมเต็มแล้ว (${MAX_TEAM}/6)` : 'เพิ่มเข้าทีม'}
                      className={`w-full rounded-xl px-2 py-2 text-sm font-bold text-white ${
                        isFull ? 'cursor-not-allowed bg-[#b9c2ba]' : 'bg-[#d9513c] shadow-sm hover:bg-[#bd4232]'
                      }`}
                    >
                      เพิ่มเข้าทีม
                    </button>
                  )}
                  {isFull && !inTeam && (
                    <p className="mt-1 text-center text-xs text-[#8b968e]">ทีมเต็มแล้ว (6/6)</p>
                  )}
                </PokemonCard>
              )
            })}
          </div>
        </>
      )}

    </div>
  )
}

export default PokemonList
