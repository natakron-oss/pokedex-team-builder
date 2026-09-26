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

  const { add, remove, has, isFull } = useTeam()

  const loading = list.loading || (type && typeRes.loading)
  const error = list.error || (type ? typeRes.error : null)
  // เลือกธาตุแล้วยังโหลดรายชื่อธาตุไม่เสร็จ → ยังกรองไม่ได้ ถือว่า loading
  const waitingType = Boolean(type && !typeRes.data && !typeRes.error)

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
      <h1 className="text-2xl font-bold">Pokédex (#1–#151)</h1>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => updateParams({ q: e.target.value })}
          placeholder="ค้นหาชื่อ เช่น char"
          className="flex-1 rounded-md border px-3 py-2"
        />
        <select
          value={type}
          onChange={(e) => updateParams({ type: e.target.value })}
          className="rounded-md border px-3 py-2"
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
        <p className="mt-6 text-gray-500">ไม่พบผลลัพธ์</p>
      ) : (
        <>
          <p className="mt-4 text-sm text-gray-500">พบ {results.length} ตัว</p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {results.map((p) => {
              const inTeam = has(p.id)
              return (
                <PokemonCard key={p.id} id={p.id} name={p.name}>
                  {inTeam ? (
                    <button
                      onClick={() => remove(p.id)}
                      className="mt-2 w-full rounded-md border border-red-600 px-2 py-1 text-sm font-semibold text-red-600"
                    >
                      เอาออกจากทีม
                    </button>
                  ) : (
                    <button
                      onClick={() => add(p)}
                      disabled={isFull}
                      title={isFull ? `ทีมเต็มแล้ว (${MAX_TEAM}/6)` : 'เพิ่มเข้าทีม'}
                      className={`mt-2 w-full rounded-md px-2 py-1 text-sm font-semibold text-white ${
                        isFull ? 'cursor-not-allowed bg-gray-300' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      เพิ่มเข้าทีม
                    </button>
                  )}
                  {isFull && !inTeam && (
                    <p className="mt-1 text-xs text-gray-400">ทีมเต็มแล้ว (6/6)</p>
                  )}
                </PokemonCard>
              )
            })}
          </div>
        </>
      )}

      <p className="mt-6 text-xs text-gray-400">
        ค้นหา + ธาตุอยู่ใน URL — copy ลิงก์ส่งเพื่อนได้เลย
      </p>
    </div>
  )
}

export default PokemonList
