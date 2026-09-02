import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email('Email không hợp lệ. Vui lòng nhập đúng định dạng (VD: example@gmail.com)'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự để đảm bảo an toàn'),
})

export const onboardingSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(50, 'Tên không được vượt quá 50 ký tự').trim(),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không đúng định dạng tại Việt Nam'),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày sinh không hợp lệ'),
  address: z.string().min(5, 'Địa chỉ quá ngắn, vui lòng nhập rõ Quận/Huyện, Tỉnh/Thành phố').trim(),
})
