// R4, R5: TeamProvider + useTeam() (ทางเข้าเดียว) · สูงสุด 6 ตัว ห้ามซ้ำ · เก็บใน localStorage
import { createContext, useContext, useEffect, useState } from 'react'

const TeamContext = createContext(null)

export const MAX_TEAM = 6
const STORAGE_KEY = 'pokedex-team'

function loadTeam() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    // รูปแบบที่คาด: array ของ { id: number, name: string }
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (m) => m && typeof m === 'object' && Number.isInteger(m.id) && typeof m.name === 'string',
    )
  } catch {
    // ข้อมูลเสีย (เช่น 'abc') → ถือว่าทีมว่าง ห้ามจอขาว (Twist 7)
    return []
  }
}

export function TeamProvider({ children }) {
  // lazy init อ่าน localStorage ครั้งเดียวตอน mount
  const [team, setTeam] = useState(loadTeam)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team))
    } catch {
      // localStorage เต็ม/เขียนไม่ได้ → ข้าม ไม่ให้แอปพัง
    }
  }, [team])

  const add = (pokemon) => {
    setTeam((prev) => {
      if (prev.some((m) => m.id === pokemon.id)) return prev // ห้ามซ้ำ
      if (prev.length >= MAX_TEAM) return prev // เต็มแล้วห้ามเพิ่ม
      return [...prev, { id: pokemon.id, name: pokemon.name }]
    })
  }

  const remove = (id) => {
    setTeam((prev) => prev.filter((m) => m.id !== id))
  }

  const clear = () => setTeam([])

  // คำนวณตอน render — ไม่เก็บเป็น state แยก (R4)
  const has = (id) => team.some((m) => m.id === id)
  const count = team.length
  const isFull = count >= MAX_TEAM

  return (
    <TeamContext.Provider value={{ team, add, remove, clear, has, count, isFull }}>
      {children}
    </TeamContext.Provider>
  )
}

// ทั้งโปรเจกต์เรียก useContext ได้ที่เดียวคือตรงนี้ (ใน useTeam)
export function useTeam() {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeam() ต้องใช้ภายใน <TeamProvider> เท่านั้น')
  return ctx
}
