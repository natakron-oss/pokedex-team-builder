// R6: zod schema ของฟอร์มลงทะเบียนทีม — ไฟล์แยกตามโจทย์
import { z } from 'zod'

// รับชื่อ Pokémon ในทีมเพื่อเช็ก "ชื่อทีมห้ามซ้ำกับชื่อ Pokémon ในทีม (ไม่สนตัวพิมพ์)"
// Twist 8: ทีมมี pikachu แล้วตั้งชื่อทีมว่า Pikachu → error; ลบ pikachu ออกแล้วผ่าน
export function createRegistrationSchema(teamNames = []) {
  const lower = teamNames.map((n) => String(n).toLowerCase())

  return z
    .object({
      trainerName: z
        .string()
        .min(2, 'ชื่อเทรนเนอร์ต้องมีอย่างน้อย 2 ตัวอักษร')
        .max(30, 'ชื่อเทรนเนอร์ต้องไม่เกิน 30 ตัวอักษร'),
      teamName: z
        .string()
        .min(3, 'ชื่อทีมต้องมีอย่างน้อย 3 ตัวอักษร')
        .max(20, 'ชื่อทีมต้องไม่เกิน 20 ตัวอักษร')
        .regex(/^[A-Za-z0-9 ]+$/, 'ชื่อทีมใช้ได้เฉพาะ A–Z a–z 0–9 และช่องว่าง')
        .refine((val) => !lower.includes(val.toLowerCase()), {
          message: 'ชื่อทีมซ้ำกับ Pokémon ในทีม',
        }),
      email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
      confirmEmail: z.string().min(1, 'กรุณายืนยันอีเมล'),
    })
    // error ของอีเมลไม่ตรงกันต้องขึ้นที่ช่อง confirmEmail (path ชี้ช่องนั้น)
    .refine((data) => data.email === data.confirmEmail, {
      message: 'อีเมลไม่ตรงกัน',
      path: ['confirmEmail'],
    })
}

// schema พื้นฐาน (ไม่มีรายชื่อทีมให้เทียบ) — เผื่อ import ตรง ๆ
export const registrationSchema = createRegistrationSchema([])

export default registrationSchema
