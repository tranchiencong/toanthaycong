/**
 * Module bảo vệ chống Bot Spam và Giới hạn tần suất đăng ký (Anti-abuse)
 */

type AttemptRecord = {
  count: number
  firstAttemptTime: number
}

// Lưu trữ bộ nhớ đệm tần suất theo IP / Email trong 10 phút
const rateLimitMap = new Map<string, AttemptRecord>()
const WINDOW_MS = 10 * 60 * 1000 // 10 phút
const MAX_ATTEMPTS = 6 // Tối đa 6 lần đăng ký / 10 phút từ 1 IP hoặc Email

export function checkRegistrationRateLimit(identifier: string): {
  allowed: boolean
  remainingTimeSeconds?: number
} {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record) {
    rateLimitMap.set(identifier, { count: 1, firstAttemptTime: now })
    return { allowed: true }
  }

  // Nếu quá thời gian cửa sổ 10 phút, reset lại
  if (now - record.firstAttemptTime > WINDOW_MS) {
    rateLimitMap.set(identifier, { count: 1, firstAttemptTime: now })
    return { allowed: true }
  }

  if (record.count >= MAX_ATTEMPTS) {
    const remainingTimeSeconds = Math.ceil((WINDOW_MS - (now - record.firstAttemptTime)) / 1000)
    return { allowed: false, remainingTimeSeconds }
  }

  record.count += 1
  return { allowed: true }
}

/**
 * Xác thực token Cloudflare Turnstile
 * Tự động bỏ qua nếu chưa cấu hình secret key trong môi trường (giữ cho dev mượt mà)
 */
export async function verifyTurnstileToken(token: string | null | undefined): Promise<boolean> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
  if (!secretKey) {
    // Chưa cấu hình Turnstile -> Bỏ qua an toàn cho dev/staging
    return true
  }

  if (!token) return false

  try {
    const formData = new FormData()
    formData.append('secret', secretKey)
    formData.append('response', token)

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    const outcome = (await res.json()) as { success: boolean }
    return outcome.success
  } catch (error) {
    console.error('Lỗi khi kiểm tra Turnstile token:', error)
    return true // Không chặn học sinh nếu service Cloudflare gặp sự cố kết nối
  }
}
