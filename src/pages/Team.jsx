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
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold tracking-[0.16em] text-[#d9513c]">YOUR LINEUP</p>
            <h1 className="mt-1 text-3xl font-black text-[#20312b]">ทีมของฉัน <span className="text-[#4e9a72]">{team.length}/{MAX_TEAM}</span></h1>
          </div>
          {team.length > 0 && (
            <button onClick={() => { clear(); setSummary(null) }} className="rounded-full border border-[#e8cbc4] px-4 py-2 text-sm font-bold text-[#c64d3c] hover:bg-[#fff0ed]">
              ล้างทีม
            </button>
          )}
        </div>

        {team.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-[#cbd6ca] bg-white/55 px-5 py-10 text-center">
            <p className="text-lg font-extrabold text-[#425249]">ยังไม่มีสมาชิกในทีม</p>
            <p className="mt-1 text-sm text-[#78847c]">เลือก Pokémon อย่างน้อย 3 ตัวเพื่อปลดล็อกการลงทะเบียนทีม</p>
            <Link to="/pokemon" className="mt-5 inline-flex rounded-full bg-[#d9513c] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#bd4232]">ไปเลือก Pokémon</Link>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {team.map((m) => (
              <PokemonCard key={m.id} id={m.id} name={m.name}>
                <button
                  onClick={() => remove(m.id)}
                  className="w-full rounded-xl border border-[#e8cbc4] bg-white px-2 py-2 text-sm font-bold text-[#c64d3c] hover:bg-[#fff0ed]"
                >
                  เอาออก
                </button>
              </PokemonCard>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#dfe5dc] pt-7">
        <p className="text-xs font-extrabold tracking-[0.16em] text-[#d9513c]">MAKE IT OFFICIAL</p>
        <h2 className="mt-1 text-2xl font-black text-[#20312b]">ลงทะเบียนทีม</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 max-w-md space-y-4" noValidate>
          <Field label="ชื่อเทรนเนอร์" error={errors.trainerName}>
            <input {...register('trainerName')} className="mt-1 w-full rounded-xl border border-[#dfe5dc] bg-white/85 px-3 py-2.5 outline-none focus:border-[#4e9a72]" />
          </Field>
          <Field label="ชื่อทีม" error={errors.teamName}>
            <input {...register('teamName')} className="mt-1 w-full rounded-xl border border-[#dfe5dc] bg-white/85 px-3 py-2.5 outline-none focus:border-[#4e9a72]" />
          </Field>
          <Field label="อีเมล" error={errors.email}>
            <input {...register('email')} type="email" className="mt-1 w-full rounded-xl border border-[#dfe5dc] bg-white/85 px-3 py-2.5 outline-none focus:border-[#4e9a72]" />
          </Field>
          <Field label="ยืนยันอีเมล" error={errors.confirmEmail}>
            <input {...register('confirmEmail')} type="email" className="mt-1 w-full rounded-xl border border-[#dfe5dc] bg-white/85 px-3 py-2.5 outline-none focus:border-[#4e9a72]" />
          </Field>

          {!canSubmit && (
            <p className="text-sm text-amber-700">
              ทีมมี {team.length} ตัว — ต้องมีอย่างน้อย {MIN_TEAM} ตัว ขาดอีก {missing} ตัว
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={`rounded-full px-5 py-2.5 font-bold text-white ${
              !canSubmit || isSubmitting ? 'cursor-not-allowed bg-[#b9c2ba]' : 'bg-[#d9513c] hover:bg-[#bd4232]'
            }`}
          >
            {isSubmitting ? 'กำลังส่ง…' : 'ลงทะเบียนทีม'}
          </button>
        </form>

        {summary && (
          <div className="mt-6 max-w-md rounded-2xl border border-[#b9d8bf] bg-[#eef7ec] p-5">
            <h3 className="font-black text-[#347b55]">ลงทะเบียนสำเร็จ</h3>
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
