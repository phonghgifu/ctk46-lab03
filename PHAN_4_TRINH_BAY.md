# Hướng Dẫn Trình Bày Phần 4 vào Word

## 📄 Cấu Trúc Word Document

```
PHẦN 4: SERVER ACTIONS & FORM HANDLING
└─ 4.1. Khái Niệm Server Actions
   └─ So sánh: API Routes vs Server Actions
└─ 4.2. Cài Đặt Zod & Validation Schema
   └─ Ví dụ: guestbookSchema
└─ 4.3. Thực Hành: Guestbook với Server Actions
   ├─ app/guestbook/actions.ts
   ├─ components/guestbook-form.tsx
   ├─ components/delete-button.tsx
   └─ app/guestbook/page.tsx (Server Component)
└─ 4.4. Thực Hành: Contact Form
   ├─ app/contact/actions.ts
   └─ app/contact/page.tsx
└─ Kết Quả & Testing
└─ Commit & Git
```

---

## 1️⃣ Slide 1: PHẦN 4 - SERVER ACTIONS & FORM HANDLING

**Tiêu đề:** Phần 4: Server Actions & Form Handling
**Thời lượng:** ~35 phút

**Nội dung chính:**
- Server Actions là cách hiện đại xử lý form trong Next.JS
- Thay vì API Route + fetch → gọi Server Action trực tiếp
- Type-safe, Progressive enhancement, Validation tích hợp

**Tại sao cần học?**
- Phần 3 (API Routes) có những vấn đề:
  - ❌ Không type-safe JSON serialization/deserialization
  - ❌ Validation thủ công
  - ❌ Cần fetch + error handling từ client
  - ❌ Không progressive enhancement
- Phần 4 (Server Actions) giải quyết tất cả:
  - ✅ Type-safe end-to-end
  - ✅ Zod validation declarative
  - ✅ Revalidation tích hợp
  - ✅ Progressive enhancement

---

## 2️⃣ Slide 2: So Sánh API Routes vs Server Actions

**Bảng so sánh:**

| Tiêu Chí | API Routes (Phần 3) | Server Actions (Phần 4) |
|---------|-------------------|----------------------|
| **Cách tạo** | file api/endpoint/route.ts | function với "use server" |
| **Cách gọi** | client: fetch('/api/...') | form: action={serverAction} |
| **Type-safe** | ❌ JSON serialization issues | ✅ TypeScript end-to-end |
| **Validation** | ❌ Thủ công | ✅ Zod schema |
| **Progressive enhancement** | ❌ Cần JavaScript | ✅ Form hoạt động không JS |
| **Revalidation** | ⚠️ Thủ công (await fetch) | ✅ revalidatePath() tích hợp |
| **Code complexity** | 250 lines (Phần 3) | 40 lines (Phần 4) |

**Kết luận:** Server Actions đơn giản hơn, type-safe hơn, UX tốt hơn.

---

## 3️⃣ Slide 3: Cài Đặt Zod

**Bước 1: Cài đặt**
```bash
npm install zod
```

**Bước 2: Import & Tạo Schema**
```typescript
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  age: z.number().min(18, "Phải từ 18 tuổi trở lên"),
});
```

**Bước 3: Validate**
```typescript
const result = userSchema.safeParse(data);

if (!result.success) {
  console.log(result.error.flatten().fieldErrors);
  // { name: [...], email: [...], age: [...] }
} else {
  console.log(result.data); // Type-safe data
}
```

**💡 Tại sao Zod?**
- Một schema cho cả validation + TypeScript types
- Error messages riêng per field
- Composable & extendable

---

## 4️⃣ Slide 4: Guestbook Schema (app/guestbook/actions.ts)

**Code:**
```typescript
"use server"; // ← Chạy trên server

import { z } from "zod";
import { revalidatePath } from "next/cache";

const guestbookSchema = z.object({
  name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự"),
  message: z
    .string()
    .min(1, "Lời nhắn không được để trống")
    .max(500, "Lời nhắn không được quá 500 ký tự"),
});

export interface ActionState {
  success: boolean;
  errors?: {
    name?: string[];
    message?: string[];
  };
}
```

**📝 Giải thích:**
- `"use server"` - toàn bộ file chạy trên server
- `z.object()` - định nghĩa cấu trúc dữ liệu
- `.min(2, "...")` - validation rule với error message
- `ActionState` interface - type return của Server Action

---

## 5️⃣ Slide 5: createGuestbookEntry Server Action

**Code:**
```typescript
export async function createGuestbookEntry(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. Lấy dữ liệu từ form
  const rawData = {
    name: formData.get("name") as string,
    message: formData.get("message") as string,
  };

  // 2. Validate bằng Zod
  const result = guestbookSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // 3. Thêm entry mới
  const newEntry = {
    id: Date.now().toString(),
    name: result.data.name,
    message: result.data.message,
    createdAt: new Date().toISOString(),
  };

  guestbookEntries.unshift(newEntry);

  // 4. Revalidate trang
  revalidatePath("/guestbook");

  return { success: true };
}
```

**🎯 Ưu điểm:**
- `safeParse()` không throw → dễ handle error
- Tự động flatten errors per field
- `revalidatePath()` tự động re-render Server Component
- Type-safe: `formData.get()` trả về unknown, cast as string

---

## 6️⃣ Slide 6: GuestbookForm Component

**Code (components/guestbook-form.tsx):**
```typescript
"use client";

import { useActionState } from "react";
import { createGuestbookEntry, ActionState } from "@/app/guestbook/actions";

const initialState: ActionState = { success: false };

export default function GuestbookForm() {
  const [state, formAction, isPending] = useActionState(
    createGuestbookEntry,
    initialState
  );

  return (
    <form action={formAction} className="bg-gray-50 rounded-lg p-6">
      <div>
        <label>Tên của bạn</label>
        <input
          name="name" {/* ← Attribute name rất quan trọng */}
          type="text"
          placeholder="Nhập tên của bạn"
        />
        {state.errors?.name && (
          <p className="text-red-500">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label>Lời nhắn</label>
        <textarea
          name="message"
          placeholder="Viết lời nhắn của bạn..."
        />
        {state.errors?.message && (
          <p className="text-red-500">{state.errors.message[0]}</p>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Đang gửi..." : "Gửi lời nhắn"}
      </button>

      {state.success && (
        <p className="text-green-600">Gửi lời nhắn thành công!</p>
      )}
    </form>
  );
}
```

**✨ Điểm chính:**
- `useActionState()` - React 19 hook
- `form action={formAction}` - tự động gọi Server Action
- `isPending` - tự động true khi submit
- `state.errors` - error từ Zod

---

## 7️⃣ Slide 7: Server Component Guestbook Page

**Code (app/guestbook/page.tsx):**
```typescript
// ❌ KHÔNG "use client" nữa!
// ✅ Server Component

import { guestbookEntries } from "@/data/guestbook";
import GuestbookForm from "@/components/guestbook-form";
import DeleteButton from "@/components/delete-button";

export default function GuestbookPage() {
  const entries = guestbookEntries;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Sổ lưu bút</h1>

      <GuestbookForm /> {/* Client Component */}

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="border rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">{entry.name}</span>
              <DeleteButton id={entry.id} />
            </div>
            <p>{entry.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**✅ Lợi ích:**
- Server Component → tải nhanh (no JavaScript overhead)
- Truy cập data trực tiếp
- Không cần useEffect + loading state
- `revalidatePath()` tự động update khi submit form

---

## 8️⃣ Slide 8: DeleteButton Component

**Code (components/delete-button.tsx):**
```typescript
"use client";

import { deleteGuestbookEntry } from "@/app/guestbook/actions";

export default function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    await deleteGuestbookEntry(id);
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-600"
    >
      Xóa
    </button>
  );
}
```

**Đơn giản nhưng mạnh:**
- Gọi Server Action `deleteGuestbookEntry()` trực tiếp
- Confirmation dialog trước khi delete
- Tự động update UI sau delete (nhờ revalidatePath)

---

## 9️⃣ Slide 9: Contact Form - Server Action

**Code (app/contact/actions.ts):**
```typescript
"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được quá 100 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  subject: z
    .string()
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(200, "Tiêu đề không được quá 200 ký tự"),
  message: z
    .string()
    .min(10, "Nội dung phải có ít nhất 10 ký tự")
    .max(2000, "Nội dung không được quá 2000 ký tự"),
});

export async function sendContactMessage(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  const result = contactSchema.safeParse(rawData);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  // Trong thực tế: gửi email hoặc lưu DB
  console.log("Tin nhắn liên hệ:", result.data);

  return { success: true };
}
```

---

## 🔟 Slide 10: Contact Page Form Layout

**Code (app/contact/page.tsx - phần form):**
```typescript
"use client";

import { useActionState } from "react";
import { sendContactMessage } from "./actions";

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    { success: false }
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Liên hệ</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Trái: Thông tin liên hệ */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4">
            <h3 className="font-semibold">Email</h3>
            <a href="mailto:2212440@sv.dlu.edu.vn">2212440@sv.dlu.edu.vn</a>
          </div>
          <div className="bg-gray-50 p-4">
            <h3 className="font-semibold">GitHub</h3>
            <a href="https://github.com/ngovanphong">github.com/ngovanphong</a>
          </div>
        </div>

        {/* Phải: Form */}
        <div className="md:col-span-2">
          {state.success ? (
            <div className="bg-green-50 border border-green-200 p-6">
              <h3 className="text-green-700 font-semibold">Gửi thành công!</h3>
              <p className="text-green-600">Tôi sẽ phản hồi sớm nhất.</p>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {/* 4 input fields: name, email, subject, message */}
              {/* Mỗi field có error display */}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 1️⃣1️⃣ Slide 11: Testing & Kết Quả

**Test Guestbook:**
```bash
URL: http://localhost:3001/guestbook

1. Gửi form hợp lệ
   → Entry mới hiển thị ngay
   → Form reset

2. Để trống "Tên"
   → Lỗi: "Tên phải có ít nhất 2 ký tự"

3. Nhập 1 ký tự
   → Lỗi validation

4. Nhấn Xóa
   → Confirm dialog
   → Entry bị xóa
   → Danh sách update ngay
```

**Test Contact:**
```bash
URL: http://localhost:3001/contact

1. Email sai format
   → Lỗi: "Email không hợp lệ"

2. Subject < 5 ký tự
   → Lỗi validation

3. Form hợp lệ
   → Thông báo "Gửi thành công!"
   → Terminal log: "Tin nhắn liên hệ: {...}"
```

---

## 1️⃣2️⃣ Slide 12: Commit & Git

**Commit:**
```bash
git add .
git commit -m "feat: thêm Server Actions cho Guestbook và Contact form với Zod validation"
```

**Kết quả:**
```
[master d7f2d91] feat: thêm Server Actions cho Guestbook...
 8 files changed, 404 insertions(+), 240 deletions(-)
 create mode 100644 app/contact/actions.ts
 create mode 100644 app/guestbook/actions.ts
 create mode 100644 components/delete-button.tsx
 create mode 100644 components/guestbook-form.tsx
```

---

## 📊 Bảng So Sánh: Phần 3 vs Phần 4

| Yếu tố | Phần 3 | Phần 4 |
|--------|-------|-------|
| Cách tạo | api/guestbook/route.ts | app/guestbook/actions.ts |
| Gọi từ form | fetch + button onClick | form action attribute |
| State quản lý | 6+ useState | 1 useActionState |
| Code complexity | 250 lines | 90 lines |
| Validation | Thủ công | Zod schema |
| Type-safe | ⚠️ Phần nào | ✅ Hoàn toàn |
| Progressive enhancement | ❌ | ✅ |
| Revalidation | Thủ công | Tự động |

---

## 💡 Key Takeaways

1. **Server Actions** = Modern form handling trong Next.JS
2. **"use server"** directive = Chạy code trên server
3. **Zod** = Declarative validation schema
4. **useActionState()** = React 19 hook để connect form + Server Action
5. **revalidatePath()** = Tự động refresh UI sau mutation
6. **Progressive enhancement** = Form hoạt động không cần JavaScript
7. **Ít code, nhiều tính năng** = 70% giảm complexity vs Phần 3

---

## ✅ Checklist Trình Bày

- [ ] Giải thích Server Actions là gì
- [ ] So sánh API Routes vs Server Actions
- [ ] Demo Guestbook form validation
- [ ] Show error messages từ Zod
- [ ] Demo delete functionality
- [ ] Test Contact form validation
- [ ] Kiểm tra Terminal log
- [ ] Giải thích revalidatePath() hoạt động
- [ ] Nêu ưu điểm so với Phần 3

---

## 🎓 Câu Hỏi Có Thể Gặp

**Q: Tại sao phải dùng "use server"?**
A: Để đánh dấu rằng hàm chạy trên server, không được gửi sang client. Tự động serialize/deserialize.

**Q: formData.get("name") trả về gì?**
A: Trả về string | File | null. Cần cast as string nếu chắc chắn là string.

**Q: Zod error.flatten() làm gì?**
A: Chuyển errors thành object: `{ fieldName: [messages] }`. Dễ render trong UI.

**Q: Tại sao revalidatePath() cần?**
A: ISR/Dynamic Route caching. Revalidate bảo Next.JS lấy lại data mới lần tiếp theo.

**Q: useActionState vs form onSubmit?**
A: useActionState hỗ trợ progressive enhancement (form hoạt động không JS). onSubmit không.
