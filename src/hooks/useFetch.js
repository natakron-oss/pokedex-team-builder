// R1: custom hook สำหรับ fetch ทุกจุด — รองรับ url = null (ไม่ยิง),
// เช็ก res.ok (PokéAPI คืน 404 จริง) และ cleanup กัน response เก่าทับใหม่ (Twist 5)
import { useEffect, useState } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(url))
  const [error, setError] = useState(null)

  useEffect(() => {
    // url เป็น null = ไม่ต้องยิง (ใช้กับ endpoint ธาตุตอนยังไม่เลือกธาตุ)
    if (!url) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`โหลดไม่สำเร็จ (HTTP ${res.status})`)
        const json = await res.json()
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    // cleanup: กัน response เก่ามาทับ response ใหม่ (กด ถัดไป รัว ๆ)
    return () => {
      cancelled = true
    }
  }, [url])

  return { data, loading, error }
}

export default useFetch
