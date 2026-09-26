// R4, R6: การ์ดสมาชิก · เอาออก/ล้างทีม · ข้อความทีมว่าง · ฟอร์มลงทะเบียนทีม (ต้องมีอย่างน้อย 3 ตัว)
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTeam, MAX_TEAM } from '../context/TeamContext.jsx'
import { createRegistrationSchema } from '../schemas/registration.js'
import PokemonCard from '../components/PokemonCard.jsx'

const MIN_TEAM = 3

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  )
}

function Team() {
  const { team, remove, clear } = useTeam()
  const [summary, setSummary] = useState(null)

  // schema ผูกกับรายชื่อทีมปัจจุบัน (เช็กชื่อทีมซ้ำแบบไม่สนตัวพิมพ์ — Twist 8)
  const schema = useMemo(
    () => createRegistrationSchema(team.map((m) => m.name)),
    [team],
  )

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched', // ไม่ขึ้น error ก่อนผู้ใช้แตะช่อง (Twist 9)
  })

  // ทีมเปลี่ยน (เช่นลบ pikachu ออก) → ตรวจชื่อทีมใหม่ทันที จะได้กดส่งผ่าน (Twist 8)
  // ข้ามรอบแรกตอน mount — ไม่งั้น error จะโผล่ก่อนผู้ใช้แตะฟอร์ม (Twist 9)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    trigger('teamName')
  }, [team, trigger])

  const missing = Math.max(0, MIN_TEAM - team.length)
  const canSubmit = missing === 0

  const onSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 800)) // จำลองรอ 800ms
    setSummary({ ...values, members: [...team] })
  }

  return (
    <div className="space-y-6 rounded-lg border bg-white p-4 shadow-sm sm:p-6">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">ทีมของฉัน ({team.length}/{MAX_TEAM})</h1>
          {team.length > 0 && (
            <button onClick={() => { clear(); setSummary(null) }} className="text-sm text-red-600">
              ล้างทีม
            </button>
          )}
        </div>

        {team.length === 0 ? (
          <p className="mt-4 text-gray-500">
            ทีมยังว่าง — <Link to="/pokemon" className="text-red-600">ไปเลือก Pokémon</Link> เข้าทีมก่อน
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {team.map((m) => (
              <PokemonCard key={m.id} id={m.id} name={m.name}>
                <button
                  onClick={() => remove(m.id)}
                  className="mt-2 w-full rounded-md border border-red-600 px-2 py-1 text-sm font-semibold text-red-600"
                >
                  เอาออก
                </button>
              </PokemonCard>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-bold">ลงทะเบียนทีม</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 max-w-md space-y-4" noValidate>
          <Field label="ชื่อเทรนเนอร์" error={errors.trainerName}>
            <input {...register('trainerName')} className="mt-1 w-full rounded-md border px-3 py-2" />
          </Field>
          <Field label="ชื่อทีม" error={errors.teamName}>
            <input {...register('teamName')} className="mt-1 w-full rounded-md border px-3 py-2" />
          </Field>
          <Field label="อีเมล" error={errors.email}>
            <input {...register('email')} type="email" className="mt-1 w-full rounded-md border px-3 py-2" />
          </Field>
          <Field label="ยืนยันอีเมล" error={errors.confirmEmail}>
            <input {...register('confirmEmail')} type="email" className="mt-1 w-full rounded-md border px-3 py-2" />
          </Field>

          {!canSubmit && (
            <p className="text-sm text-amber-700">
              ทีมมี {team.length} ตัว — ต้องมีอย่างน้อย {MIN_TEAM} ตัว ขาดอีก {missing} ตัว
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={`rounded-md px-4 py-2 font-semibold text-white ${
              !canSubmit || isSubmitting ? 'cursor-not-allowed bg-gray-300' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSubmitting ? 'กำลังส่ง…' : 'ลงทะเบียนทีม'}
          </button>
        </form>

        {summary && (
          <div className="mt-6 max-w-md rounded-lg border border-green-300 bg-green-50 p-4">
            <h3 className="font-bold text-green-800">ลงทะเบียนสำเร็จ</h3>
            <p className="mt-2 text-sm">เทรนเนอร์: <b>{summary.trainerName}</b></p>
            <p className="mt-1 text-sm">ชื่อทีม: <b>{summary.teamName}</b></p>
            <p className="mt-1 text-sm">สมาชิก ({summary.members.length} ตัว):</p>
            <ul className="mt-1 list-inside list-disc text-sm capitalize">
              {summary.members.map((m) => (
                <li key={m.id}>#{m.id} {m.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Team
