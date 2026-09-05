# Kế hoạch Triển khai Chi tiết Hệ thống (Master Implementation Plan)
## Nền Tảng Học Toán Trực Tuyến - Toán Thầy Công

> [!IMPORTANT]
> **Bản Kế Hoạch Thực Thi Toàn Diện (Senior Architecture & Step-by-Step Blueprint)**  
> Được xây dựng sau khi rà soát toàn bộ mã nguồn thực tế tại kho lưu trữ `e:\toanthaycong`. Kế hoạch này chuyển hóa kiến trúc Next.js 16 (React 19), Prisma ORM 7 và Supabase SSR thành các đầu việc (Tasks) chi tiết, cụ thể theo từng file, kèm điều kiện nghiệm thu rõ ràng để tiến hành lập trình ngay lập tức.

---

## I. Đánh Giá Hiện Trạng & Phân Tích Lỗ Hổng (Current Audit & Gap Analysis)

Sau khi rà soát toàn bộ source code hiện tại của dự án, hiện trạng được xác định như sau:

### 1. Các thành phần đã hoàn thành vững chắc (Done & Solid)
- [x] **Cơ sở dữ liệu (Prisma 7 + Supabase Postgres):** Schema hoàn chỉnh gồm 11 models: `Grade`, `Subject`, `User` (với Enum `Role: STUDENT, TEACHER, ADMIN`), `Course`, `Chapter`, `Lesson`, `LessonResource`, `ActivationCode`, `Enrollment`, `Comment`, `Review`. Đã cấu hình Index và Cascade Delete.
- [x] **Xác thực cơ bản (Auth & Onboarding):**
  - Trang `/login` và Server Action `authAction` hỗ trợ đăng ký & đăng nhập qua Supabase SSR.
  - Trang `/onboarding` và Server Action `updateProfile` thu thập thông tin cá nhân (Họ tên, SĐT, Ngày sinh, Địa chỉ) được validate chặt chẽ qua Zod.
- [x] **Giao diện Marketing & Giới thiệu:**
  - Trang chủ Landing Page (`src/app/(marketing)/page.tsx`) với Hero, thống kê, cảm nhận học sinh.
  - Trang danh mục khóa học (`src/app/(marketing)/courses/page.tsx`) có bộ lọc theo khối lớp và môn học.
  - Trang chi tiết khóa học (`src/app/(marketing)/courses/[slug]/page.tsx`) hiển thị chương trình học và giáo viên.
- [x] **Kích hoạt khóa học:** Server Action `activateCourseAction` sử dụng Prisma Transaction để kiểm tra mã, chống tái sử dụng và tạo `Enrollment`.
- [x] **Khung video bài học cơ bản:** Trang `/learn/[courseSlug]/[lessonSlug]` đã tích hợp `react-lite-youtube-embed` tải nhanh, kiểm tra quyền sở hữu hoặc cờ `isPreview`.

---

### 2. Các "Điểm Nghẽn" & Lỗ Hổng Cần Khắc Phục Ngay (Critical Gaps to Fix)

| STT | Lỗ hổng / Thiếu sót | Vị trí ảnh hưởng | Mức độ nghiêm trọng | Giải pháp kỹ thuật |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Gãy luồng chuyển hướng sau Login/Onboarding (404 Not Found)** | `src/app/login/actions.ts`, `src/app/onboarding/actions.ts` | **Rất cao (Blocker)** | Cả hai action đều gọi `redirect('/dashboard')`, nhưng thư mục `src/app/dashboard` **chưa tồn tại**. Cần xây dựng ngay trang Dashboard học sinh. |
| **2** | **Proxy chưa phân quyền & chưa bảo vệ route (RBAC)** | `src/proxy.ts` (Next.js 16) | **Cao (Security)** | `proxy.ts` mới chỉ làm mới token Supabase, chưa kiểm tra đăng nhập khi vào `/dashboard`, `/learn`, `/teacher`, `/admin`; chưa chặn học sinh vào trang giáo viên; chưa ép chuyển hướng về `/onboarding` nếu chưa cập nhật hồ sơ. |
| **3** | **Chưa có tính năng theo dõi tiến độ (Progress Tracking)** | `src/app/learn/[courseSlug]/[lessonSlug]` | **Cao (Core UX)** | Chưa có nút "Đã hoàn thành bài học", chưa có Server Action cập nhật mảng `completedLessons` và tính lại trường `progress` (0-100%) trong bảng `Enrollment`. |
| **4** | **Hệ thống Hỏi đáp & Thảo luận chưa hoạt động** | `LessonPage` (`src/app/learn`) | **Trung bình** | UI hiển thị thông báo tĩnh *"Khu vực thảo luận sẽ được mở sau..."*, chưa có Form gửi câu hỏi và chưa render danh sách `Comment` từ DB. |
| **5** | **Thiếu Cổng Quản Trị Giáo Viên (`/teacher`)** | Chưa có route | **Rất cao (Vận hành)** | Thầy cô chưa có giao diện tạo/sửa khóa học, thêm chương/bài giảng, và đặc biệt là công cụ **sinh mã kích hoạt hàng loạt (Batch Code Generator)**. |
| **6** | **Thiếu Cổng CRM Quản Trị Học Sinh (`/admin`)** | Chưa có route | **Rất cao (Kinh doanh)** | Đội ngũ quản lý và telesale chưa có bảng danh sách học sinh để lọc theo Năm sinh (độ tuổi ôn thi), SĐT, Tỉnh thành để chăm sóc và tư vấn khóa học. |
| **7** | **Thiếu tối ưu SEO tự động** | `sitemap.xml`, `robots.txt`, metadata | **Trung bình** | Chưa có `sitemap.ts` tự động xuất danh sách khóa học cho Google Bot, chưa có Open Graph preview ảnh khi chia sẻ lên Zalo/Facebook. |

---

## II. Chuẩn Mực Kiến Trúc Kỹ Thuật (Architecture Standards)

Dự án tuân thủ nghiêm ngặt các nguyên tắc sau:
1. **Next.js 16 + React 19:**
   - Sử dụng `src/proxy.ts` (chuẩn chính thức của Next.js 16 thay thế `middleware.ts`) để bảo vệ định tuyến tại tầng mạng máy chủ.
   - Toàn bộ `params` và `searchParams` phải xử lý bất đồng bộ (`await params`).
   - Mặc định là **React Server Components (RSC)** để truy vấn dữ liệu trực tiếp bằng Prisma, loại bỏ API Routes trung gian dư thừa.
   - Các form đột biến dữ liệu (Mutations) sử dụng **Server Actions** (`'use server'`) kết hợp hook React 19 `useActionState` và `useTransition`.
2. **Prisma 7 + PostgreSQL:**
   - Mọi thao tác ghi dữ liệu nhạy cảm (Kích hoạt khóa học, Sinh mã hàng loạt) phải bọc trong `prisma.$transaction`.
   - Sử dụng đúng relations và `@index` đã định nghĩa để tốc độ phản hồi đạt dưới 50ms.
3. **Bảo mật & Xác thực Dữ liệu (Zero Trust):**
   - 100% dữ liệu đầu vào từ người dùng phải được parse và validate qua **Zod** (`src/lib/validations.ts`) trước khi chạm vào Database.
   - Mọi Server Action trong vùng người dùng/giáo viên/admin phải kiểm tra lại Session từ Supabase và Role từ Database, không tin tưởng trạng thái ở Client.
4. **Thiết kế Giao diện (UI/UX):**
   - Sử dụng Tailwind CSS v4, Lucide React icons.
   - Bảng màu sư phạm cao cấp: Deep Navy (`#0f172a`, `#1e3a8a`), Brand Blue (`#2563eb`), Emerald Green (`#10b981`), Amber/Orange điểm nhấn (`#f59e0b`).
   - Responsive hoàn hảo trên điện thoại (Mobile-First) cho học sinh sử dụng smartphone để học.

---

## III. Cấu Trúc Thư Mục Mục Tiêu (Target Project Structure)

```
src/
├── app/
│   ├── (marketing)/                  # Không gian công khai (SEO & Bán khóa học)
│   │   ├── courses/
│   │   │   ├── [slug]/page.tsx       # Chi tiết khóa học & nút kích hoạt
│   │   │   └── page.tsx              # Danh mục khóa học + lọc
│   │   ├── page.tsx                  # Landing page
│   │   └── layout.tsx
│   ├── dashboard/                    # [MỚI] Không gian của Học sinh
│   │   ├── page.tsx                  # Khóa học của tôi, tiến độ học, kích hoạt mã nhanh
│   │   ├── layout.tsx                # Header học viên, thông tin tài khoản, logout
│   │   └── loading.tsx
│   ├── learn/                        # Không gian phòng học video
│   │   └── [courseSlug]/
│   │       ├── layout.tsx            # Sidebar danh sách chương/bài học & thanh tiến độ
│   │       └── [lessonSlug]/
│   │           ├── page.tsx          # Video player, nút hoàn thành bài, tài liệu
│   │           ├── actions.ts        # [MỚI] Action đánh dấu hoàn thành & gửi bình luận
│   │           └── components/       # VideoPlayer, CommentSection, CompleteButton
│   ├── teacher/                      # [MỚI] Cổng Quản lý Dành cho Giáo viên
│   │   ├── layout.tsx                # Guard kiểm tra role TEACHER/ADMIN + Sidebar giáo viên
│   │   ├── page.tsx                  # Thống kê nhanh khóa học, học sinh, mã kích hoạt
│   │   ├── courses/                  # Quản lý khóa học, bài giảng
│   │   │   ├── page.tsx              # Danh sách khóa học của tôi
│   │   │   ├── new/page.tsx          # Tạo khóa học mới
│   │   │   └── [id]/
│   │   │       ├── edit/page.tsx     # Sửa thông tin chung
│   │   │       └── curriculum/page.tsx # Thêm/Sửa/Xóa Chương & Bài giảng
│   │   └── activation-codes/         # Quản lý mã kích hoạt
│   │       ├── page.tsx              # Bảng mã & Form sinh hàng loạt (Batch Generator)
│   │       └── actions.ts            # Server action tạo mã ngẫu nhiên
│   ├── admin/                        # [MỚI] Cổng Quản trị CRM Dành cho Admin
│   │   ├── layout.tsx                # Guard kiểm tra role ADMIN + Sidebar admin
│   │   ├── page.tsx                  # Dashboard chỉ số kinh doanh & học tập
│   │   └── students/                 # CRM Học sinh phục vụ Telesale & CSKH
│   │       ├── page.tsx              # Bảng lọc theo Năm sinh, SĐT, Tỉnh thành
│   │       └── StudentTableClient.tsx# Bộ lọc động & Xuất dữ liệu
│   ├── login/                        # Đăng nhập & Đăng ký
│   ├── onboarding/                   # Bổ sung thông tin cá nhân lần đầu
│   ├── sitemap.ts                    # [MỚI] Sitemap XML động
│   ├── robots.ts                     # [MỚI] Quy định index bot
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Đã cập nhật hiển thị theo trạng thái Auth
│   │   └── Footer.tsx
│   └── ui/                           # Thành phần giao diện dùng chung (Modal, Badge, Input, Button)
├── lib/
│   ├── prisma.ts
│   ├── validations.ts                # Toàn bộ Zod schemas mở rộng
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       └── middleware.ts
└── proxy.ts                          # [MỚI CẬP NHẬT] Bảo vệ định tuyến RBAC
```

---

## IV. Kế Hoạch Triển Khai Chi Tiết Từng Giai Đoạn (Execution Roadmap)

### Giai Đoạn 1: Vá Lỗ Hổng Điều Hướng, Proxy RBAC & Student Dashboard
> **Mục tiêu:** Giải quyết dứt điểm lỗi 404 sau khi login/onboarding, bảo vệ an toàn toàn bộ hệ thống bằng phân quyền phân cấp (Role-Based Access Control) tại `proxy.ts`, và tạo trải nghiệm học sinh chuyên nghiệp tại `/dashboard`.

#### Task 1.1: Hoàn thiện `src/proxy.ts` (Next.js 16 RBAC & Onboarding Gate)
- **Mục tiêu:** Kiểm tra session Supabase cho mọi route được bảo vệ; tự động chuyển hướng người dùng chưa đủ thông tin về `/onboarding`; ngăn chặn học sinh truy cập `/teacher` hoặc `/admin`.
- **Files liên quan:**
  - `[MODIFY] src/proxy.ts`
  - `[MODIFY] src/lib/supabase/middleware.ts`
- **Nghiệp vụ chi tiết:**
  1. Kiểm tra session qua `supabase.auth.getUser()`.
  2. Nếu truy cập các route bắt đầu bằng `/dashboard`, `/learn`, `/teacher`, `/admin` mà chưa đăng nhập -> Chuyển hướng ngay về `/login?redirect=...`.
  3. Nếu đã đăng nhập nhưng truy cập `/login` -> Chuyển hướng về `/dashboard`.
  4. Nếu đã đăng nhập nhưng chưa hoàn tất hồ sơ (truy vấn nhanh thông tin user từ session metadata hoặc cookie) và đang không ở `/onboarding` -> Chuyển hướng về `/onboarding`.
  5. Nếu truy cập `/teacher` nhưng vai trò không phải `TEACHER` hoặc `ADMIN` -> Từ chối quyền truy cập (redirect về `/dashboard`).
  6. Nếu truy cập `/admin` nhưng vai trò không phải `ADMIN` -> Từ chối quyền truy cập (redirect về `/dashboard`).
- **Nghiệm thu:** 
  - Thử mở trình duyệt ẩn danh vào thẳng `/dashboard` hoặc `/teacher` -> Bị đá về `/login`.
  - Đăng nhập với tài khoản học sinh truy cập `/admin` -> Bị đá về `/dashboard`.

#### Task 1.2: Xây dựng Không gian Học viên (`src/app/dashboard/page.tsx` & `layout.tsx`)
- **Mục tiêu:** Màn hình trung tâm của học sinh khi đăng nhập, hiển thị tiến độ học tập và các khóa học đang sở hữu.
- **Files liên quan:**
  - `[NEW] src/app/dashboard/layout.tsx`
  - `[NEW] src/app/dashboard/page.tsx`
  - `[NEW] src/app/dashboard/loading.tsx`
  - `[NEW] src/app/dashboard/DashboardActivationCard.tsx`
- **Nghiệp vụ chi tiết:**
  1. Truy vấn Prisma bằng Server Component:
     - Lấy thông tin user (Họ tên, SĐT, Email).
     - Lấy danh sách `Enrollment` kèm theo thông tin chi tiết của `Course` (tiêu đề, ảnh bìa/tag, khối lớp, danh sách bài giảng để đếm tổng bài).
  2. Thiết kế giao diện:
     - **Thẻ chào mừng & Chỉ số tổng quan:** Tổng số khóa học đã tham gia, số bài học đã hoàn thành, thời gian học tập.
     - **Danh sách "Khóa học của tôi":** Thẻ từng khóa học hiển thị thanh tiến độ (Progress bar xanh lá), số bài đã học / tổng số bài, nút bấm nổi bật: *"Tiếp tục học"* dẫn thẳng vào bài học dở dang hoặc bài đầu tiên.
     - **Khu vực Kích hoạt khóa học nhanh:** Cho phép học sinh nhập ngay mã thẻ cào/kích hoạt nhận từ Thầy Công để mở khóa học tức thì mà không cần tìm lại trang chi tiết.
     - **Gợi ý khóa học mới:** Đối với học sinh chưa sở hữu khóa học nào, hiển thị danh sách khóa học tiêu biểu cùng lời kêu gọi kích hoạt mã.
- **Nghiệm thu:**
  - Đăng nhập tài khoản học sinh -> Vào thẳng `/dashboard` không bị lỗi 404.
  - Hiển thị đúng khóa học đã kích hoạt kèm thanh % tiến độ.
  - Bấm "Tiếp tục học" chuyển hướng mượt mà vào bài học tương ứng trong `/learn`.

---

### Giai Đoạn 2: Hoàn Thiện Trải Nghiệm Học Tập Chuyên Sâu (Learning Flow)
> **Mục tiêu:** Biến không gian học tập thành một trải nghiệm mượt mà, trực quan với đầy đủ tính năng ghi nhận tiến độ học và thảo luận hỏi đáp trực tiếp với giáo viên.

#### Task 2.1: Server Actions Ghi Nhận Hoàn Thành Bài Học & Tính Toán Tiến Độ
- **Mục tiêu:** Khi học sinh hoàn thành bài giảng, hệ thống tự động lưu trữ và tính lại tỷ lệ phần trăm của khóa học.
- **Files liên quan:**
  - `[NEW] src/app/learn/[courseSlug]/[lessonSlug]/actions.ts`
  - `[MODIFY] src/lib/validations.ts`
- **Nghiệp vụ chi tiết:**
  1. Viết `toggleLessonCompleteAction(courseId, lessonId)`:
     - Kiểm tra xác thực người dùng hiện tại từ Supabase.
     - Tìm bản ghi `Enrollment` tương ứng với `studentId` và `courseId`.
     - Nếu `lessonId` chưa có trong mảng `completedLessons` -> Thêm vào mảng. Nếu đã có -> (Tùy chọn: bỏ đánh dấu hoặc giữ nguyên).
     - Đếm tổng số bài học của toàn bộ khóa học (`prisma.lesson.count({ where: { chapter: { courseId } } })`).
     - Tính lại trường `progress = Math.round((completedLessons.length / totalLessons) * 100)`.
     - Cập nhật lại bản ghi `Enrollment`.
     - Gọi `revalidatePath('/learn/[courseSlug]', 'layout')` và `revalidatePath('/dashboard', 'page')`.
- **Nghiệm thu:**
  - Học sinh bấm hoàn thành bài học -> Database lưu đúng `completedLessons`, `progress` tăng chính xác theo tỷ lệ phần trăm.

#### Task 2.2: Nâng cấp Giao diện Bài Giảng & Đồng Bộ Sidebar
- **Mục tiêu:** Nút bấm trực quan cho học sinh, nút chuyển bài trước/sau tự động, và icon tích xanh tại sidebar.
- **Files liên quan:**
  - `[MODIFY] src/app/learn/[courseSlug]/layout.tsx`
  - `[MODIFY] src/app/learn/[courseSlug]/[lessonSlug]/page.tsx`
  - `[NEW] src/app/learn/[courseSlug]/[lessonSlug]/CompleteLessonButton.tsx`
- **Nghiệp vụ chi tiết:**
  1. `CompleteLessonButton.tsx`:
     - Client component sử dụng `useTransition` để hiển thị trạng thái *"Đang lưu..."*.
     - Hiển thị nút bấm to, rõ ràng: Trạng thái chưa học -> Màu xanh dương *"Đánh dấu đã hoàn thành"*; Trạng thái đã học -> Màu xanh lá *"✓ Đã hoàn thành"*.
     - Kèm nút *"Bài tiếp theo"* tự động trỏ đến `slug` của bài giảng liền sau trong chương trình học.
  2. Nâng cấp Sidebar trong `layout.tsx`:
     - Hiển thị thanh tiến độ tổng thể của khóa học ngay trên đầu sidebar (VD: *"Tiến độ: 4/12 bài (33%)"* kèm thanh progress bar).
     - Đối với bài học đã nằm trong `completedLessons`, hiển thị icon `CheckCircle2` màu xanh lá sáng rõ, tạo động lực hoàn thành cho học sinh.
- **Nghiệm thu:**
  - Bấm "Đánh dấu đã hoàn thành", nút đổi trạng thái ngay lập tức, sidebar hiện dấu tích xanh cho bài đó, tiến độ trên thanh đầu trang tăng lên.
  - Bấm "Bài tiếp theo" chuyển hướng sang bài kế tiếp mượt mà.

#### Task 2.3: Xây dựng Module Hỏi Đáp & Thảo Luận Bài Giảng
- **Mục tiêu:** Kích hoạt khu vực bình luận dưới mỗi bài giảng, cho phép học sinh đặt câu hỏi và giáo viên/trợ giảng phản hồi.
- **Files liên quan:**
  - `[NEW] src/app/learn/[courseSlug]/[lessonSlug]/DiscussionSection.tsx`
  - `[MODIFY] src/app/learn/[courseSlug]/[lessonSlug]/actions.ts`
  - `[MODIFY] src/lib/validations.ts`
- **Nghiệp vụ chi tiết:**
  1. Định nghĩa `commentSchema` trong `validations.ts`: `content: z.string().min(3, 'Nội dung câu hỏi quá ngắn').max(1000)`.
  2. Viết `postCommentAction(lessonId, content, parentId?)`:
     - Kiểm tra user đăng nhập và quyền truy cập bài học.
     - Tạo bản ghi mới vào bảng `Comment` với quan hệ đệ quy `parentId` (cho phép trả lời bình luận cấp 2).
     - `revalidatePath` trang bài học hiện tại.
  3. Giao diện `DiscussionSection.tsx`:
     - Khung soạn thảo câu hỏi thân thiện với học sinh (kèm avatar và họ tên học sinh).
     - Danh sách bình luận hiển thị theo thứ tự mới nhất, có huy hiệu *"Giáo viên"* nổi bật nếu người trả lời là Thầy Công / Trợ giảng (`role !== 'STUDENT'`).
- **Nghiệm thu:**
  - Học sinh nhập bình luận -> Xuất hiện ngay trên màn hình.
  - Bình luận lưu đúng vào database, gắn đúng `lessonId` và `userId`.

---

### Giai Đoạn 3: Phân Hệ Quản Trị Giáo Viên (`/teacher`)
> **Mục tiêu:** Cung cấp đầy đủ công cụ để Thầy Công quản lý bài giảng, kiểm soát học liệu, và đặc biệt là hệ thống **sinh mã kích hoạt hàng loạt** để cung cấp cho học sinh đăng ký học.

#### Task 3.1: Khởi tạo Layout & Bảo vệ Cổng Giáo Viên
- **Mục tiêu:** Khung làm việc chuyên nghiệp, trang nhã, bảo mật tuyệt đối cho giáo viên.
- **Files liên quan:**
  - `[NEW] src/app/teacher/layout.tsx`
  - `[NEW] src/app/teacher/page.tsx`
  - `[NEW] src/app/teacher/Sidebar.tsx`
- **Nghiệp vụ chi tiết:**
  1. Kiểm tra xác thực tại Server Component: Chỉ người dùng có role `TEACHER` hoặc `ADMIN` mới được render giao diện, ngược lại chuyển hướng về `/dashboard`.
  2. Menu Sidebar giáo viên:
     - **Tổng quan:** Số liệu học sinh đang học, số khóa học đang mở, số mã đã kích hoạt.
     - **Quản lý Khóa học:** Danh sách khóa học, thêm bài giảng mới, cấu hình học thử.
     - **Kho Mã Kích Hoạt (Activation Codes):** Sinh mã mới, theo dõi mã đã dùng.
  3. Trang Dashboard giáo viên (`src/app/teacher/page.tsx`): Các thẻ thống kê (Metric Cards) với biểu tượng trực quan: Tổng số học sinh, Tổng khóa học, Tổng mã kích hoạt đã cấp.

#### Task 3.2: Quản lý Khóa Học, Chương & Bài Giảng (`/teacher/courses`)
- **Mục tiêu:** Cho phép giáo viên cập nhật nội dung học tập một cách trực quan, không cần can thiệp kỹ thuật.
- **Files liên quan:**
  - `[NEW] src/app/teacher/courses/page.tsx`
  - `[NEW] src/app/teacher/courses/new/page.tsx`
  - `[NEW] src/app/teacher/courses/[id]/edit/page.tsx`
  - `[NEW] src/app/teacher/courses/[id]/curriculum/page.tsx`
  - `[NEW] src/app/teacher/courses/actions.ts`
  - `[MODIFY] src/lib/validations.ts`
- **Nghiệp vụ chi tiết:**
  1. **Quản lý Khóa học:**
     - Form tạo/sửa khóa học: Tên khóa học, Khối lớp (lựa chọn từ bảng `Grade`), Môn học (`Subject`), Mô tả, Trạng thái (Đang soạn thảo / Đã xuất bản `isPublished`).
     - Tự động sinh `slug` thân thiện SEO từ tên khóa học (VD: *"Khóa Ôn Thi Đại Học Điểm 9+"* -> `khoa-on-thi-dai-hoc-diem-9`).
  2. **Quản lý Chương & Bài giảng (`curriculum`):**
     - Thêm mới / Đổi tên Chương (Chapter).
     - Thêm Bài giảng (Lesson): Tên bài, nhập mã YouTube Video ID (hoặc link đầy đủ được tự động bóc tách ID), tích chọn `isPreview` để cho học sinh học thử miễn phí, thời lượng dự kiến.
     - Đính kèm tài liệu học tập (Link Google Drive, PDF tài liệu dạng URL).
     - Sắp xếp thứ tự bài học tăng dần theo `orderNum`.
- **Nghiệm thu:**
  - Giáo viên tạo khóa học mới -> Xuất hiện ngay trên trang danh mục khóa học (nếu chọn `isPublished: true`).
  - Thêm bài giảng với YouTube ID -> Học sinh vào học xem được video chuẩn xác.

#### Task 3.3: Trình Quản Lý & Sinh Mã Kích Hoạt Hàng Loạt (Batch Code Generator)
- **Mục tiêu:** Tạo ra hàng chục hoặc hàng trăm mã kích hoạt duy nhất cho mỗi đợt tuyển sinh, in thẻ học hoặc gửi tin nhắn cho học sinh.
- **Files liên quan:**
  - `[NEW] src/app/teacher/activation-codes/page.tsx`
  - `[NEW] src/app/teacher/activation-codes/actions.ts`
  - `[NEW] src/app/teacher/activation-codes/BatchGenerateForm.tsx`
  - `[NEW] src/app/teacher/activation-codes/CodeTableClient.tsx`
- **Nghiệp vụ chi tiết:**
  1. **Form sinh mã hàng loạt (`BatchGenerateForm.tsx`):**
     - Chọn khóa học cần cấp mã.
     - Nhập số lượng mã muốn sinh (Ví dụ: 10, 20, 50, 100 mã).
     - Tiền tố mã tùy chọn (Ví dụ: `TOAN10-`, `THAYCONG-`, `VIP-`).
  2. **Server Action `generateActivationCodesAction`:**
     - Sử dụng thuật toán sinh chuỗi ngẫu nhiên ký tự hoa & số (A-Z, 0-9) có độ dài 6-8 ký tự (VD: `TTC-9K2A-7X9F`).
     - Kiểm tra tính duy nhất (Uniqueness) trong database để tránh xung đột mã.
     - Sử dụng `prisma.activationCode.createMany` để lưu toàn bộ mã vào Database trong 1 câu lệnh cực nhanh.
  3. **Bảng hiển thị & Quản trị mã (`CodeTableClient.tsx`):**
     - Hiển thị danh sách mã kích hoạt: Mã, Khóa học, Trạng thái (Chưa sử dụng / Đã kích hoạt), Học sinh đã kích hoạt (Tên + SĐT), Thời gian kích hoạt.
     - Nút *"Sao chép tất cả mã chưa dùng"* (Click-to-copy danh sách mã ra clipboard) để Thầy Công gửi nhanh cho học sinh qua Zalo/Facebook.
     - Bộ lọc mã: Lọc theo khóa học, lọc mã chưa sử dụng, tìm kiếm mã cụ thể.
- **Nghiệm thu:**
  - Chọn sinh 20 mã -> Hệ thống tạo ngay 20 mã duy nhất gắn với khóa học đã chọn.
  - Lấy 1 mã vừa sinh đem sang trang kích hoạt của học sinh -> Kích hoạt thành công, trạng thái mã trong bảng giáo viên tự động chuyển thành "Đã kích hoạt".

---

### Giai Đoạn 4: Phân Hệ Quản Trị CRM & Vận Hành Dành Cho Admin (`/admin`)
> **Mục tiêu:** Cung cấp cho đội ngũ vận hành và tư vấn tuyển sinh (Telesale/CSKH) bức tranh toàn cảnh về dữ liệu học sinh, cho phép lọc theo năm sinh và tỉnh thành để hỗ trợ học sinh tối đa.

#### Task 4.1: Cấu Trúc Khung Quản Trị Admin
- **Mục tiêu:** Không gian làm việc riêng biệt cho quản trị viên tối cao (`ADMIN`).
- **Files liên quan:**
  - `[NEW] src/app/admin/layout.tsx`
  - `[NEW] src/app/admin/page.tsx`
  - `[NEW] src/app/admin/AdminSidebar.tsx`
- **Nghiệp vụ chi tiết:**
  1. Kiểm tra xác thực Server: Chỉ tài khoản có `role === 'ADMIN'` mới có quyền truy cập.
  2. Thống kê tổng quan (`src/app/admin/page.tsx`):
     - Tổng số học sinh đã đăng ký tài khoản.
     - Tỷ lệ học sinh đã kích hoạt ít nhất 1 khóa học (Conversion Rate).
     - Tổng số lượt hoàn thành bài giảng trong tuần/tháng.

#### Task 4.2: CRM Học Sinh Đa Chiêu Thức Phục Vụ Telesale & CSKH (`/admin/students`)
- **Mục tiêu:** Bảng dữ liệu học sinh với các bộ lọc thông minh, giúp đội ngũ tuyển sinh nắm bắt ngay độ tuổi, lớp học và địa bàn của học sinh.
- **Files liên quan:**
  - `[NEW] src/app/admin/students/page.tsx`
  - `[NEW] src/app/admin/students/StudentFilterBar.tsx`
  - `[NEW] src/app/admin/students/StudentTable.tsx`
- **Nghiệp vụ chi tiết:**
  1. Truy vấn Prisma tổng hợp dữ liệu học sinh:
     - Họ tên, Email, Số điện thoại, Ngày sinh / Tuổi, Địa chỉ (Tỉnh/Thành phố).
     - Số lượng khóa học đã sở hữu (`_count: { enrollments: true }`).
     - Danh sách tên các khóa học đã đăng ký.
  2. Bộ lọc dữ liệu đa chiều (`StudentFilterBar.tsx`):
     - **Lọc theo Năm sinh / Độ tuổi:** Ví dụ học sinh sinh năm 2008 (chuẩn bị thi vào 10), sinh năm 2007 (lớp 12 ôn thi tốt nghiệp THPT).
     - **Lọc theo Địa chỉ / Tỉnh thành:** Hà Nội, TP.HCM, Hải Phòng, Nghệ An, Nam Định... (hỗ trợ các chiến dịch tư vấn theo địa phương).
     - **Lọc theo Trạng thái học tập:** "Đã có khóa học" vs "Đã đăng ký nhưng chưa kích hoạt khóa nào" (tập khách hàng tiềm năng cao để gọi điện hướng dẫn nhận mã).
     - **Tìm kiếm tức thì:** Tìm theo Số điện thoại hoặc Họ tên học sinh.
  3. Tiện ích thực chiến:
     - Nút gọi điện nhanh (`tel:...`) cho nhân viên telesale thao tác trên máy tính/điện thoại.
     - Nút copy SĐT nhanh chỉ với 1 click.
     - Xuất dữ liệu ra định dạng bảng tính (CSV/Excel) để bàn giao danh sách cho đội CSKH.
- **Nghiệm thu:**
  - Admin vào trang `/admin/students` thấy đầy đủ thông tin học sinh từ form onboarding.
  - Lọc học sinh theo năm sinh hiển thị chính xác danh sách tương ứng.

---

### Giai Đoạn 5: Tối Ưu SEO Đỉnh Cao, Hiệu Năng & Kiểm Thử Toàn Diện
> **Mục tiêu:** Giúp website Toán Thầy Công đạt điểm tối đa về SEO kỹ thuật trên Google, hiển thị đẹp mắt khi chia sẻ trên mạng xã hội, và vận hành mượt mà không lỗi phát sinh.

#### Task 5.1: Thiết lập SEO Tự Động (`sitemap.ts`, `robots.ts`, Structured Data)
- **Mục tiêu:** Google Bot tự động lập chỉ mục đầy đủ toàn bộ khóa học mà không cần can thiệp thủ công.
- **Files liên quan:**
  - `[NEW] src/app/sitemap.ts`
  - `[NEW] src/app/robots.ts`
  - `[MODIFY] src/app/(marketing)/courses/[slug]/page.tsx`
- **Nghiệp vụ chi tiết:**
  1. `src/app/sitemap.ts`:
     - Tự động gọi Prisma lấy toàn bộ `slug` của các khóa học có `isPublished: true`.
     - Xuất chuẩn XML chứa: Trang chủ, Danh mục khóa học, và toàn bộ trang chi tiết khóa học kèm `lastModified` và `changeFrequency`.
  2. `src/app/robots.ts`:
     - Cho phép bot lập chỉ mục các trang công khai (`/`, `/courses`).
     - Chặn bot index các trang nội bộ bảo mật (`/dashboard`, `/learn`, `/teacher`, `/admin`, `/login`, `/onboarding`).
  3. Structured Data (Schema.org JSON-LD):
     - Bổ sung schema `Course` và `EducationalOrganization` vào trang chi tiết khóa học.
     - Khai báo tên khóa học, mô tả, tên giáo viên (Thầy Công), khối lớp để Google hiển thị Rich Snippets đẹp mắt trên kết quả tìm kiếm.

#### Task 5.2: Hoàn thiện Xử lý Lỗi & Trạng Thái Tải Trang (UX Polish)
- **Mục tiêu:** Loại bỏ hoàn toàn màn hình trắng khi tải trang hoặc khi gặp lỗi kết nối.
- **Files liên quan:**
  - `[NEW] src/app/not-found.tsx`
  - `[NEW] src/app/error.tsx`
  - `[NEW] src/app/(marketing)/courses/loading.tsx`
  - `[NEW] src/app/learn/[courseSlug]/loading.tsx`
- **Nghiệp vụ chi tiết:**
  1. Xây dựng trang `404 Not Found` mang phong cách Toán học thú vị (minh họa đồ thị, công thức) kèm nút quay về trang chủ.
  2. Xây dựng trang `error.tsx` thân thiện, có nút bấm *"Thử lại"* để kích hoạt lại Server Action hoặc tải lại trang khi rớt mạng.
  3. Tạo các hiệu ứng Skeleton Loader bằng Tailwind CSS v4 mô phỏng khung bài giảng trong lúc Server Components đang nạp dữ liệu.

#### Task 5.3: Kiểm thử Toàn diện & Build Production
- **Mục tiêu:** Đảm bảo toàn bộ hệ thống biên dịch sạch sẽ, không có lỗi TypeScript, không có lỗi runtime.
- **Lệnh kiểm thử:**
  1. `npm run lint` -> Kiểm tra lỗi cú pháp và quy chuẩn code Next.js 16 / React 19.
  2. `npx prisma validate` -> Kiểm tra tính toàn vẹn của Prisma Schema.
  3. `npm run build` -> Biên dịch toàn bộ dự án sang bản dựng Production. Kiểm tra kỹ lưỡng các trang tĩnh và động.

---

## V. Kế Hoạch Kiểm Thử & Nghiệm Thu (Verification Plan)

| Luồng nghiệp vụ | Kịch bản kiểm thử (Test Scenario) | Kết quả kỳ vọng |
| :--- | :--- | :--- |
| **1. Xác thực & Onboarding** | Người dùng mới đăng ký -> điền Họ tên, SĐT, Ngày sinh, Địa chỉ | Chuyển hướng thành công vào `/dashboard`. Dữ liệu lưu đúng vào bảng `User` trong Postgres. |
| **2. Proxy Bảo vệ RBAC** | Trình duyệt ẩn danh gõ URL `/dashboard` hoặc `/teacher` | Bị chặn ngay lập tức và chuyển hướng về `/login`. Học sinh vào `/admin` bị đá về `/dashboard`. |
| **3. Sinh & Quản lý Mã** | Giáo viên vào `/teacher/activation-codes` chọn sinh 10 mã khóa Toán 10 | 10 mã ngẫu nhiên xuất hiện ngay trong bảng, có thể bấm nút Copy toàn bộ danh sách mã. |
| **4. Kích hoạt Khóa học** | Học sinh nhập 1 mã vừa sinh tại `/dashboard` hoặc trang chi tiết khóa | Thông báo kích hoạt thành công. Khóa học xuất hiện ngay trong danh sách khóa học của học sinh. Mã chuyển sang trạng thái `isUsed: true`. |
| **5. Học tập & Tiến độ** | Học sinh vào xem video bài 1, bấm *"Đánh dấu đã hoàn thành"* | Nút chuyển sang tích xanh, sidebar hiện icon hoàn thành, tiến độ tổng khóa học cập nhật chính xác. |
| **6. Thảo luận Bài học** | Học sinh nhập câu hỏi ở phần thảo luận | Câu hỏi xuất hiện ngay lập tức kèm họ tên học sinh, lưu thành công vào bảng `Comment`. |
| **7. CRM Telesale** | Admin vào `/admin/students`, lọc học sinh sinh năm 2008 tại Hà Nội | Bảng trả về đúng danh sách học sinh thỏa mãn điều kiện, hiển thị SĐT rõ ràng để gọi tư vấn. |
| **8. Build Kiểm tra** | Chạy `npm run build` trên terminal | Build thành công 100%, không phát sinh bất kỳ lỗi TypeScript hay dynamic server usage nào. |

---

> [!TIP]
> **Hướng Tiếp Cận Triển Khai Thực Tế:**  
> Kế hoạch trên được sắp xếp theo đúng thứ tự phụ thuộc (Dependencies First). Khuyến nghị tiến hành tuần tự từ **Giai đoạn 1** (giải quyết dứt điểm lỗi 404 `/dashboard` và bảo vệ phân quyền `proxy.ts`), sau đó sang **Giai đoạn 2** (trải nghiệm học tập), tiếp đến **Giai đoạn 3 & 4** (cổng Thầy cô & CRM Admin), và kết thúc ở **Giai đoạn 5** (SEO & đóng gói triển khai).
