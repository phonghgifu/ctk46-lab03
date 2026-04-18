# Phần 4: Server Actions & Form Handling - Hướng Dẫn Chi Tiết

## 📚 Tổng Quan

Phần 4 chuyển từ cách truyền thống (API Routes + fetch) sang **Server Actions** - cách hiện đại để xử lý form trong Next.JS.

### ✨ Điểm nổi bật của Server Actions:

1. **Type-safe end-to-end** - TypeScript từ server đến client
2. **Progressive enhancement** - Form hoạt động ngay cả không có JavaScript
3. **Revalidation tích hợp** - `revalidatePath()` tự động cập nhật UI
4. **Validation với Zod** - Schema validation declarative
5. **Ít state cần quản lý** - Đơn giản hơn so với useEffect + fetch

---

## 🛠️ Cách Hoạt Động

### **Phần 3 (API Routes):**
```
Client Form 
  ↓ (fetch POST)
API Route (/api/guestbook)
  ↓ (thêm data)
In-memory array
  ↓ (client tự refresh)
Client UI update
```

### **Phần 4 (Server Actions):**
```
Client Form (action={formAction})
  ↓ (auto serialize FormData)
Server Action ("use server")
  ↓ (Zod validation)
In-memory array
  ↓ (revalidatePath auto refresh)
Server Component re-render
  ↓
Client UI update
```

---

## 📁 Cấu Trúc File Phần 4

```
app/
├── guestbook/
│   ├── actions.ts ← NEW! Server Actions
│   └── page.tsx ← Updated: Server Component (không còn "use client")
├── contact/
│   ├── actions.ts ← NEW! Server Actions
│   └── page.tsx ← Updated: Server-side validation form
└── api/
    └── guestbook/ ← Vẫn giữ (tương thích ngược)

components/
├── guestbook-form.tsx ← NEW! Form component với useActionState
└── delete-button.tsx ← NEW! Delete button component
```

---

## 🔍 Chi Tiết Từng File

### **1. app/guestbook/actions.ts** (60 dòng)

```typescript
"use server"; // ← Đánh dấu: chạy trên server

import { z } from "zod"; // Validation schema
import { revalidatePath } from "next/cache"; // Tự động refresh UI

const guestbookSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(50, "..."),
  message: z.string().min(1, "...").max(500, "..."),
});

export interface ActionState {
  success: boolean;
  errors?: { name?: string[]; message?: string[] };
}

export async function createGuestbookEntry(
  prevState: ActionState, // ← Trạng thái trước (cho useActionState)
  formData: FormData // ← Dữ liệu từ form
): Promise<ActionState> {
  // 1. Lấy dữ liệu
  const rawData = {
    name: formData.get("name") as string,
    message: formData.get("message") as string,
  };

  // 2. Validate với Zod
  const result = guestbookSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  // 3. Thêm entry vào array
  guestbookEntries.unshift({
    id: Date.now().toString(),
    name: result.data.name,
    message: result.data.message,
    createdAt: new Date().toISOString(),
  });

  // 4. Revalidate trang (tự động re-render server component)
  revalidatePath("/guestbook");

  return { success: true };
}
```

**🎯 Ưu điểm:**
- `safeParse()` không throw exception - dễ xử lý
- `revalidatePath()` tự động fetch lại data
- Zod errors có message riêng per field

---

### **2. components/guestbook-form.tsx** (50 dòng)

```typescript
"use client"; // ← Client component dùng useActionState

import { useActionState } from "react";
import { createGuestbookEntry, ActionState } from "@/app/guestbook/actions";

const initialState: ActionState = { success: false };

export default function GuestbookForm() {
  // useActionState(serverAction, initialState)
  // Trả về: [state, formAction, isPending]
  const [state, formAction, isPending] = useActionState(
    createGuestbookEntry,
    initialState
  );

  return (
    <form action={formAction} className="...">
      {/* Input name */}
      <input name="name" type="text" placeholder="..." />
      {/* Hiển thị lỗi từ Zod */}
      {state.errors?.name && (
        <p className="text-red-500">{state.errors.name[0]}</p>
      )}

      {/* Textarea message */}
      <textarea name="message" placeholder="..." />
      {state.errors?.message && (
        <p className="text-red-500">{state.errors.message[0]}</p>
      )}

      {/* Submit button */}
      <button type="submit" disabled={isPending}>
        {isPending ? "Đang gửi..." : "Gửi lời nhắn"}
      </button>

      {/* Success message */}
      {state.success && <p className="text-green-600">Gửi thành công!</p>}
    </form>
  );
}
```

**🎯 Điểm chính:**
- `<form action={formAction}>` - tự động gọi Server Action
- `name="name"` rất quan trọng - FormData dùng attribute name
- `isPending` tự động set khi form submit (không cần useState)
- `state.errors` từ Server Action hiển thị trực tiếp

---

### **3. app/guestbook/page.tsx** (40 dòng)

```typescript
// ❌ KHÔNG còn "use client" nữa!
// ✅ Giờ là Server Component

import { guestbookEntries } from "@/data/guestbook";
import GuestbookForm from "@/components/guestbook-form";
import DeleteButton from "@/components/delete-button";

export default function GuestbookPage() {
  const entries = guestbookEntries; // Truy cập trực tiếp data (server)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Sổ lưu bút</h1>

      {/* Form component (Client Component) */}
      <GuestbookForm />

      {/* Danh sách entries */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="border rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">{entry.name}</span>
              <DeleteButton id={entry.id} /> {/* Delete component */}
            </div>
            <p className="text-gray-600">{entry.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**✅ Lợi ích:**
- Server Component tải dữ liệu nhanh hơn
- Không cần useEffect + loading state
- Dữ liệu luôn "fresh" nhờ revalidatePath()

---

### **4. components/delete-button.tsx** (15 dòng)

```typescript
"use client";

import { deleteGuestbookEntry } from "@/app/guestbook/actions";

export default function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    await deleteGuestbookEntry(id); // ← Gọi Server Action
  }

  return (
    <button onClick={handleDelete} className="text-xs text-red-400">
      Xóa
    </button>
  );
}
```

---

### **5. app/contact/actions.ts** (50 dòng)

Tương tự Guestbook nhưng với 4 fields:
- name (2-100 ký tự)
- email (valid email format)
- subject (5-200 ký tự)
- message (10-2000 ký tự)

```typescript
const contactSchema = z.object({
  name: z.string().min(2, "...").max(100, "..."),
  email: z.string().email("Email không hợp lệ"),
  subject: z.string().min(5, "...").max(200, "..."),
  message: z.string().min(10, "...").max(2000, "..."),
});

export async function sendContactMessage(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Tương tự createGuestbookEntry
  // Kết quả: console.log("Tin nhắn liên hệ:", data)
  // Trong thực tế: gửi email hoặc lưu DB
}
```

---

### **6. app/contact/page.tsx** (140 dòng)

Grid 2 cột:
- **Trái:** Thông tin liên hệ (Email, GitHub, Địa chỉ)
- **Phải:** Contact form với validation

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
        {/* Contact info */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold">Email</h3>
            <a href="mailto:..." className="text-blue-600">...</a>
          </div>
          {/* GitHub, Địa chỉ, ... */}
        </div>

        {/* Form */}
        <div className="md:col-span-2">
          {state.success ? (
            <div className="bg-green-50 border border-green-200 p-6">
              <h3 className="text-green-700 font-semibold">Gửi thành công!</h3>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {/* 4 fields: name, email, subject, message */}
              {/* Error display */}
              {state.errors?.name && (
                <p className="text-red-500 text-sm">{state.errors.name[0]}</p>
              )}
              {/* ... */}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 Cách Test

### **1. Test Guestbook Form:**

```bash
URL: http://localhost:3001/guestbook
```

**Test cases:**
- ✅ Gửi form hợp lệ → thấy entry mới
- ❌ Để trống "Tên" → lỗi "Tên phải có ít nhất 2 ký tự"
- ❌ Nhập 1 ký tự → lỗi validation
- ❌ Nhập >500 ký tự → lỗi "Lời nhắn không được quá 500 ký tự"
- ✅ Nhấn Xóa → entry bị xóa, confirm trước

### **2. Test Contact Form:**

```bash
URL: http://localhost:3001/contact
```

**Test cases:**
- ❌ Để trống name → lỗi
- ❌ Email sai format → lỗi "Email không hợp lệ"
- ❌ Subject < 5 ký tự → lỗi
- ❌ Message < 10 ký tự → lỗi
- ✅ Form hợp lệ → "Gửi thành công!" + kiểm tra Terminal log

### **3. Kiểm tra Server Action Log:**

Trong terminal chạy dev server:

```bash
Tin nhắn liên hệ mới: {
  name: 'Nguyễn Văn A',
  email: 'a@example.com',
  subject: 'Hợp tác',
  message: 'Xin chào'
}
```

### **4. Progressive Enhancement Test:**

Mở DevTools → Network → disable JavaScript → submit form → vẫn hoạt động!

---

## 🔗 So Sánh Code Metrics

### **API Routes (Phần 3):**
```typescript
// page.tsx: 250 dòng (nhiều state management)
const [entries, setEntries] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [submitting, setSubmitting] = useState(false);

useEffect(() => {
  fetchEntries();
}, []);

async function handleSubmit(e) {
  e.preventDefault();
  const res = await fetch('/api/guestbook', { method: 'POST' });
  // ... error handling
  await fetchEntries(); // Thủ công refresh
}
```

### **Server Actions (Phần 4):**
```typescript
// page.tsx: 40 dòng (Server Component)
const entries = guestbookEntries; // Trực tiếp

// guestbook-form.tsx: 50 dòng
const [state, formAction, isPending] = useActionState(
  createGuestbookEntry,
  initialState
); // Zod validation + revalidatePath tự động
```

**📊 Kết quả:**
- **Giảm 70% code** trong page.tsx
- **Tự động refresh** (không cần thủ công)
- **Type-safe** end-to-end
- **Progressive enhancement** tích hợp

---

## 💡 Khi Nào Dùng Gì?

| Tình Huống | API Routes | Server Actions |
|-----------|-----------|-----------------|
| Form submit | ⚠️ Có thể | ✅ Tốt nhất |
| Data fetching | ✅ Tốt nhất | ⚠️ Không lý tưởng |
| CORS requests | ✅ Cần | ❌ Không hỗ trợ |
| Real-time updates | ✅ WebSocket | ❌ Không hỗ trợ |
| Client-side logic | ❌ Không | ✅ Tốt nhất |

---

## 🎓 Bài Học Chính

1. **Server Actions = Modern Form Handling** - Thay thế form handlers truyền thống
2. **Zod = Type-Safe Validation** - Một schema cho validation + TypeScript
3. **revalidatePath = Auto Refresh** - Không cần thủ công tải lại data
4. **Progressive Enhancement** - Form hoạt động không cần JavaScript
5. **Ít State Hơn** - useActionState thay thế 5-6 useState

---

## 📝 Commit

```bash
git commit -m "feat: thêm Server Actions cho Guestbook và Contact form với Zod validation"
Commit: d7f2d91
Files changed: 8
Insertions: 404
Deletions: 240
```

---

## ✅ Checklist Hoàn Tất

- [x] Cài đặt Zod (`npm install zod`)
- [x] Tạo app/guestbook/actions.ts với createGuestbookEntry & deleteGuestbookEntry
- [x] Tạo components/guestbook-form.tsx với useActionState
- [x] Tạo components/delete-button.tsx
- [x] Cập nhật app/guestbook/page.tsx (Server Component)
- [x] Tạo app/contact/actions.ts với sendContactMessage
- [x] Cập nhật app/contact/page.tsx (Contact form)
- [x] Test validation errors
- [x] Test successful submit
- [x] Test progressive enhancement
- [x] Commit changes

---

## 🚀 Tiếp Theo

- **Phần 5: shadcn/ui** - Thêm UI components library
- **Bài tập:** Thêm "reset form" button sau success
- **Nâng cao:** Thêm rate limiting (không cho phép 2 entry giống nhau trong 1 phút)
