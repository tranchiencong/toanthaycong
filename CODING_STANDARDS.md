# Tiêu chuẩn Code (Coding Standards) - Dự án Toán Thầy Công

Nhằm đảm bảo dự án có khả năng bảo trì cao, an toàn bảo mật tuyệt đối và tuân thủ các chuẩn mực của Next.js, mọi đoạn code được sinh ra từ nay về sau sẽ tuân theo các quy tắc khắt khe này.

## 1. Next.js App Router (React 19)
- **Mặc định là Server Components:** Mọi component đều render trên Server và chọc trực tiếp vào Prisma để tối ưu tốc độ và SEO.
- **Client Components (`'use client'`):** Chỉ sử dụng tại các Component "Lá" (nhỏ nhất) có chứa tương tác UI (như Form, Nút bấm, Hooks trạng thái).

## 2. Quản lý Đột biến dữ liệu (Data Mutation & Forms)
- **Cấm dùng API Routes truyền thống:** Toàn bộ Form (Đăng nhập, Tạo khóa học, Nhập mã) phải sử dụng **Server Actions** (`'use server'`).
- **Trạng thái Form chuẩn React 19:** Sử dụng `useActionState` để theo dõi trạng thái `isPending` và hiển thị lỗi, tuyệt đối không redirect báo lỗi qua URL Params (VD: `?error=1`) vì dễ bị lợi dụng.

## 3. Bảo mật & Xác thực Dữ liệu (Security - Zod)
- **Zero Trust (Không tin tưởng Client):** Mọi Server Action **bắt buộc** phải parse dữ liệu qua thư viện **Zod** (được lưu tại `src/lib/validations.ts`) trước khi thao tác với Database. 
- Điều này để chống lại hoàn toàn các cuộc tấn công **XSS** (nhúng mã độc HTML vào Input) và **Data Injection** (Ví dụ: truyền String vào trường Number).
- Thông báo lỗi trả về giao diện phải ở dạng Object vô hại, **tuyệt đối không in mã lỗi của Database (Prisma) ra ngoài màn hình người dùng**.

## 4. Prisma ORM (Database)
- Sử dụng relations `include` để truy vấn nhiều bảng cùng lúc, tránh tình trạng N+1 Query.
- Bắt buộc kiểm tra quyền sở hữu (Owner/Auth User) ở đầu mỗi Server Action thay vì chỉ dựa vào giao diện ẩn/hiện.

## 5. Styling (Tailwind v4)
- 100% sử dụng Utility Classes của Tailwind v4, không viết CSS ngoài trừ các custom animations cực kỳ phức tạp.
