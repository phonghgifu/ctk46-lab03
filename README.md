# BÀI THỰC HÀNH 4 NEXT.JS — SERVER ACTIONS & ZOD VALIDATION

## Thông Tin Dự Án

- **Sinh viên**: Ngô Văn Phong
- **MSSV**: 2212440
- **Lớp**: CTK46A
- **Môn học**: Các công nghệ mới trong PTPM
- **Năm**: 2026

## Mô Tả

Bài thực hành 4 tập trung vào việc xây dựng form với **Server Actions**, **Zod validation** và **useActionState hook**. Project bao gồm:
- React 19 & useActionState Hook
- Next.js Server Actions ("use server")
- Zod Schema Validation
- TypeScript Type Safety
- Form Handling (Guestbook & Contact)
- API Routes (GET, POST, DELETE)
- Tailwind CSS & shadcn/ui Components
- Git & GitHub

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Cấu Trúc Dự Án - Phần 4

### Server Actions
- `app/guestbook/actions.ts` - Tạo & xóa guestbook entries với Zod validation
- `app/contact/actions.ts` - Gửi tin nhắn contact với email validation

### Client Components
- `components/guestbook-form.tsx` - Form với useActionState hook
- `components/delete-button.tsx` - Nút xóa với confirm dialog

### Server Components
- `app/guestbook/page.tsx` - Trang guestbook (Server Component)
- `app/contact/page.tsx` - Trang contact form

### API Routes
- `app/api/guestbook/route.ts` - GET all, POST new entry
- `app/api/guestbook/[id]/route.ts` - DELETE entry by ID

### Data & Validation
- `data/guestbook.ts` - GuestbookEntry interface & sample data
- Zod schemas cho form validation

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about the technologies used in this lab:

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-mutation/server-actions) - Learn about Server Actions
- [Zod Documentation](https://zod.dev) - Schema validation library
- [React useActionState Hook](https://react.dev/reference/react/useActionState) - Handle form submission states
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - Build API endpoints
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.

You can check out [the ctk46-lab03 GitHub repository](https://github.com/phonghgifu/ctk46-lab03) for the complete implementation!

## Tài Liệu Hướng Dẫn

- `PHAN_4_HUONG_DAN.md` - Hướng dẫn chi tiết Phần 4
- `PHAN_4_TRINH_BAY.md` - Trình bày chi tiết các tính năng
- `PHAN_4_BAI_TAP.md` - Bài tập thực hành
- `PHAN_4_XEM_THAY_DOI.md` - Chi tiết các thay đổi

## Key Concepts

- **Server Actions**: Các hàm server-side được gọi từ client
- **Zod Validation**: Schema validation với error messages
- **useActionState Hook**: Quản lý form state và loading
- **useFormStatus**: Theo dõi form submission status
- **TypeScript Interfaces**: Type-safe data handling
- **API Routes**: RESTful endpoints cho CRUD operations
- **Error Handling**: Form error display & error boundaries
