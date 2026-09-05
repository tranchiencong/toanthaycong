'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import {
  User as UserIcon,
  ShieldCheck,
  BookOpen,
  Calendar,
  Phone,
  MapPin,
  Mail,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  KeyRound,
  Lock,
} from 'lucide-react'
import {
  updateProfileAction,
  updatePasswordAction,
  ProfileFormState,
  PasswordFormState,
} from './actions'

type EnrolledCourseItem = {
  id: string
  title: string
  slug: string
  gradeName: string
  subjectName: string
  progress: number
  totalLessons: number
  completedCount: number
}

type UsedCodeItem = {
  id: string
  code: string
  courseTitle: string
  createdAt: string
}

type ProfileTabsProps = {
  initialTab?: string
  user: {
    id: string
    email: string
    fullName: string
    phone: string | null
    dateOfBirth: string | null
    address: string | null
    bio: string | null
    role: 'STUDENT' | 'TEACHER' | 'ADMIN'
    createdAt: string
  }
  courses: EnrolledCourseItem[]
  usedCodes: UsedCodeItem[]
}

function formatDateToDDMMYYYY(dateStr?: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

function getInitials(name?: string | null): string {
  if (!name) return 'TC'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ProfileTabs({
  initialTab = 'profile',
  user,
  courses,
  usedCodes,
}: ProfileTabsProps) {
  const validTabs: Array<'profile' | 'security' | 'history'> = [
    'profile',
    'security',
    'history',
  ]
  const defaultTab = validTabs.includes(initialTab as 'profile' | 'security' | 'history')
    ? (initialTab as 'profile' | 'security' | 'history')
    : 'profile'

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'history'>(defaultTab)

  const [dob, setDob] = useState(formatDateToDDMMYYYY(user.dateOfBirth))

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 8) val = val.slice(0, 8)
    if (val.length >= 5) {
      val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`
    } else if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`
    }
    setDob(val)
  }

  const [profileState, profileFormAction, isProfilePending] = useActionState<
    ProfileFormState,
    FormData
  >(updateProfileAction, {})

  const [passwordState, passwordFormAction, isPasswordPending] = useActionState<
    PasswordFormState,
    FormData
  >(updatePasswordAction, {})

  const initials = getInitials(user.fullName)

  const roleLabel =
    user.role === 'ADMIN'
      ? 'Quản trị viên'
      : user.role === 'TEACHER'
      ? 'Giáo viên'
      : 'Học viên chính thức'

  return (
    <div className="space-y-6">
      {/* Udemy-Style Profile Header Card */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-tr from-blue-900 via-indigo-800 to-blue-700 text-white font-extrabold text-2xl sm:text-3xl shadow-md ring-4 ring-blue-50">
            {initials}
          </div>
          <span
            className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 ring-2 ring-white"
            title="Tài khoản đang hoạt động"
          />
        </div>

        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
              {user.fullName}
            </h1>
            <span className="inline-flex items-center self-center sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200">
              {roleLabel}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-2">
            <Mail className="h-4 w-4 text-slate-400" />
            <span>{user.email}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="h-3 w-3" />
              Đã xác thực
            </span>
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Thành viên từ: {formatDateToDDMMYYYY(user.createdAt)} • Hệ thống học Toán Thầy Công
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/60">
          <div className="text-right">
            <div className="text-xs font-medium text-slate-500">Khóa học sở hữu</div>
            <div className="text-lg font-bold text-slate-900">{courses.length} khóa học</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Udemy Tab Bar) */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-2 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserIcon className="h-4 w-4" />
          <span>Hồ sơ học viên</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Bảo mật tài khoản</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Khóa học & Mã thẻ ({courses.length})</span>
        </button>
      </div>

      {/* TAB 1: Profile Information */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900">Thông tin cá nhân</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Cập nhật thông tin học sinh để Thầy Công và trợ giảng tiện liên hệ gửi tài liệu và theo sát quá trình học tập.
            </p>

            {profileState.message && (
              <div
                className={`mt-4 p-4 rounded-xl flex items-start gap-3 text-sm ${
                  profileState.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {profileState.success ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{profileState.message}</span>
              </div>
            )}

            <form action={profileFormAction} className="mt-6 space-y-5">
              {/* Họ và tên */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Họ và tên <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    defaultValue={user.fullName}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-slate-900"
                  />
                </div>
                {profileState.errors?.fullName && (
                  <p className="mt-1 text-xs text-rose-600">{profileState.errors.fullName[0]}</p>
                )}
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Địa chỉ Email <span className="text-slate-400 font-normal normal-case">(Tài khoản đăng nhập)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Email đã được xác thực an toàn qua hệ thống Supabase Auth.
                </p>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Số điện thoại <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={user.phone || ''}
                    required
                    placeholder="0987654321"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-slate-900"
                  />
                </div>
                {profileState.errors?.phone && (
                  <p className="mt-1 text-xs text-rose-600">{profileState.errors.phone[0]}</p>
                )}
              </div>

              {/* Ngày sinh */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ngày sinh (dd/mm/yyyy) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={dob}
                    onChange={handleDobChange}
                    required
                    placeholder="15/08/2008"
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-slate-900"
                  />
                </div>
                {profileState.errors?.dateOfBirth && (
                  <p className="mt-1 text-xs text-rose-600">{profileState.errors.dateOfBirth[0]}</p>
                )}
              </div>

              {/* Tỉnh / Thành phố */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tỉnh / Thành phố <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="address"
                    defaultValue={user.address || ''}
                    required
                    placeholder="Hà Nội, Bắc Ninh, TP. Hồ Chí Minh..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-slate-900"
                  />
                </div>
                {profileState.errors?.address && (
                  <p className="mt-1 text-xs text-rose-600">{profileState.errors.address[0]}</p>
                )}
              </div>

              {/* Mục tiêu học tập / Lời giới thiệu */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mục tiêu học tập & Ghi chú môn Toán
                </label>
                <textarea
                  name="bio"
                  defaultValue={user.bio || ''}
                  rows={3}
                  placeholder="Ví dụ: Mục tiêu đạt 9+ THPT Quốc gia, thi đỗ Đại học Bách Khoa..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-slate-900"
                />
                {profileState.errors?.bio && (
                  <p className="mt-1 text-xs text-rose-600">{profileState.errors.bio[0]}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProfilePending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:opacity-60 transition-all"
                >
                  <span>{isProfilePending ? 'Đang lưu thông tin...' : 'Lưu thay đổi hồ sơ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: Account Security */}
      {activeTab === 'security' && (
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold text-slate-900">Bảo mật & Đổi mật khẩu</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Đổi mật khẩu định kỳ để bảo vệ quyền truy cập vào các bài giảng và khóa học đã kích hoạt của bạn.
            </p>

            {passwordState.message && (
              <div
                className={`mt-4 p-4 rounded-xl flex items-start gap-3 text-sm ${
                  passwordState.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {passwordState.success ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{passwordState.message}</span>
              </div>
            )}

            <form action={passwordFormAction} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mật khẩu mới <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-slate-900"
                  />
                </div>
                {passwordState.errors?.password && (
                  <p className="mt-1 text-xs text-rose-600">{passwordState.errors.password[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Xác nhận mật khẩu mới <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-slate-900"
                  />
                </div>
                {passwordState.errors?.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-600">{passwordState.errors.confirmPassword[0]}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPasswordPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:opacity-60 transition-all"
                >
                  <span>{isPasswordPending ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: Courses & History */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Courses List */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-900" />
              <span>Khóa học bạn đang sở hữu ({courses.length})</span>
            </h2>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-900">
                          {course.gradeName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-900">
                          {course.subjectName}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{course.completedCount}/{course.totalLessons} bài học</span>
                          <span className="font-bold text-slate-900">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/learn/${course.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition-colors"
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>Vào học tiếp</span>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                Bạn chưa sở hữu khóa học nào. Hãy sử dụng mã kích hoạt hoặc khám phá các khóa học trọng tâm của Thầy Công.
              </div>
            )}
          </div>

          {/* Used Activation Codes */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-600" />
              <span>Lịch sử mã kích hoạt đã sử dụng</span>
            </h2>

            {usedCodes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px] font-semibold">
                      <th className="py-3 px-3">Mã kích hoạt</th>
                      <th className="py-3 px-3">Khóa học mở khóa</th>
                      <th className="py-3 px-3">Ngày sử dụng</th>
                      <th className="py-3 px-3 text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usedCodes.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-blue-900">{c.code}</td>
                        <td className="py-3 px-3 font-medium text-slate-900">{c.courseTitle}</td>
                        <td className="py-3 px-3 text-slate-500">{formatDateToDDMMYYYY(c.createdAt)}</td>
                        <td className="py-3 px-3 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Đã kích hoạt
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-500 py-4">
                Chưa có lịch sử nhập mã kích hoạt nào được ghi nhận.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
