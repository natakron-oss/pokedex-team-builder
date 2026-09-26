// ของที่ให้มา — ใช้ได้เลย ไม่มีคะแนนในไฟล์นี้

export const API = 'https://pokeapi.co/api/v2'

// Pokédex นี้มีแค่รุ่นแรก #1–#151
export const MAX_ID = 151

// ธาตุขั้นต่ำที่ dropdown ต้องมี (R2) — '' = ทั้งหมด
export const TYPES = ['', 'normal', 'fire', 'water', 'grass', 'electric', 'psychic', 'poison', 'bug', 'rock', 'ghost', 'dragon']

// 'https://pokeapi.co/api/v2/pokemon/25/' → 25
export function idFromUrl(url) {
  return Number(url.split('/').filter(Boolean).pop())
}

// รูป official artwork — ไม่ต้อง fetch ใส่ใน <img src> ได้เลย
export function artworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}
