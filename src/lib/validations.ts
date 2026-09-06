import { z } from 'zod'

/**
 * Hàm phân tích ngày tháng định dạng dd/mm/yyyy hoặc yyyy-mm-dd
 */
export function parseDDMMYYYY(val: string): Date | null {
  if (!val) return null
  const trimmed = val.trim()
  const parts = trimmed.includes('/')
    ? trimmed.split('/')
    : trimmed.includes('-')
    ? trimmed.split('-')
    : null

  if (!parts || parts.length !== 3) return null

  let day: number, month: number, year: number

  if (parts[0].length === 4) {
    // YYYY-MM-DD
    year = parseInt(parts[0], 10)
    month = parseInt(parts[1], 10) - 1
    day = parseInt(parts[2], 10)
  } else if (parts[2].length === 4) {
    // DD/MM/YYYY
    day = parseInt(parts[0], 10)
    month = parseInt(parts[1], 10) - 1
    year = parseInt(parts[2], 10)
  } else {
    return null
  }

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null
  if (year < 1920 || year > new Date().getFullYear()) return null
  if (month < 0 || month > 11) return null
  if (day < 1 || day > 31) return null

  const d = new Date(year, month, day)
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) {
    return null
  }
  return d
}

export const authSchema = z.object({
  email: z.string().email('Email không hợp lệ. Vui lòng nhập đúng định dạng (VD: example@gmail.com)'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự để đảm bảo an toàn'),
})


export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự').max(50, 'Họ và tên không được quá 50 ký tự').trim(),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không đúng định dạng tại Việt Nam (VD: 0987654321)'),
  email: z.string().email('Email không hợp lệ. Vui lòng nhập đúng định dạng (VD: example@gmail.com)'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự để bảo mật tài khoản'),
  dateOfBirth: z
    .string()
    .optional()
    .refine((date) => !date || parseDDMMYYYY(date) !== null, 'Vui lòng nhập ngày sinh theo định dạng ngày/tháng/năm (VD: 15/08/2008)'),
  address: z.string().trim().optional(),
})

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự').max(50, 'Họ và tên không được quá 50 ký tự').trim(),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không đúng định dạng tại Việt Nam (VD: 0987654321)'),
  dateOfBirth: z.string().refine((date) => parseDDMMYYYY(date) !== null, 'Vui lòng nhập ngày sinh theo định dạng ngày/tháng/năm (VD: 15/08/2008)'),
  address: z.string().min(2, 'Vui lòng nhập Tỉnh / Thành phố').trim(),
  bio: z.string().max(300, 'Lời giới thiệu tối đa 300 ký tự').optional(),
})
