# Phần 4: Bài Tập Tự Làm (Exercises)

## 📝 Giới Thiệu

Phần này gồm 3 bài tập nâng cao để bạn thực hành Server Actions, Zod validation, và các tính năng khác của Next.JS.

---

## 🎯 Bài 1: Thêm "Gửi Tin Nhắn Khác" Button

### Yêu cầu:

Sau khi gửi Contact form thành công, người dùng thấy thông báo success. Thêm nút **"Gửi tin nhắn khác"** để quay lại form trống (reset state).

### Gợi ý:

1. Trong `app/contact/page.tsx`, thêm một state riêng để track xem đã gửi thành công chưa
2. Tạo button "Gửi tin nhắn khác" trong success message
3. Button click → reset state → hiển thị form lại

### Bắt đầu:

```typescript
// app/contact/page.tsx

"use client";

import { useActionState, useState } from "react";
import { sendContactMessage } from "./actions";

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(...);
  const [showForm, setShowForm] = useState(true); // ← Thêm state này

  const handleSendAnother = () => {
    setShowForm(true);
    // Cần cách nào để reset formAction state?
  };

  return (
    // ... layout
    {state.success && showForm === false ? (
      <div className="bg-green-50">
        <h3>Gửi thành công!</h3>
        <button onClick={handleSendAnother}>
          Gửi tin nhắn khác
        </button>
      </div>
    ) : (
      <form action={formAction}>
        {/* Form fields */}
      </form>
    )}
  );
}
```

### Vấn đề:

Làm sao reset `formAction` state từ useActionState? Có 2 cách:

**Cách 1: Tạo form key mới (forcing re-render)**
```typescript
const [formKey, setFormKey] = useState(0);

<form key={formKey} action={formAction}>
  {/* ... */}
</form>

const handleSendAnother = () => {
  setFormKey(prev => prev + 1); // React sẽ re-mount form
};
```

**Cách 2: Sử dụng `formRef.reset()`**
```typescript
import { useRef } from "react";

const formRef = useRef<HTMLFormElement>(null);

const handleSendAnother = () => {
  formRef.current?.reset();
  // Nhưng state từ useActionState vẫn còn
};
```

### ⭐ Best Practice:

Dùng **Cách 1** (form key) vì nó re-mount component, tất cả state reset toàn bộ.

### Solution:

```typescript
"use client";

import { useActionState, useState } from "react";
import { sendContactMessage } from "./actions";

export default function ContactPage() {
  const [formKey, setFormKey] = useState(0);
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    { success: false }
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Liên hệ</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact info - bên trái */}
        <div>{/* ... */}</div>

        {/* Form - bên phải */}
        <div className="md:col-span-2">
          {state.success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <h3 className="text-green-700 font-semibold text-lg mb-2">
                Gửi thành công!
              </h3>
              <p className="text-green-600 mb-4">
                Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi sớm nhất có thể.
              </p>
              {/* ← THÊM BUTTON NÀY */}
              <button
                onClick={() => setFormKey(prev => prev + 1)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gửi tin nhắn khác
              </button>
            </div>
          ) : (
            <form key={formKey} action={formAction} className="space-y-4">
              {/* Form fields */}
              {/* ... */}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Kiểm tra:

1. Truy cập http://localhost:3001/contact
2. Gửi form thành công → thấy success message + button "Gửi tin nhắn khác"
3. Nhấn button → form quay lại trống
4. Commit: `git add . ; git commit -m "feat: thêm button 'Gửi tin nhắn khác'"`

---

## 🎯 Bài 2: Validation - Không Cho Phép Duplicate Entry

### Yêu cầu:

Thêm validation để **không cho phép gửi cùng một message từ cùng một người trong vòng 1 phút**.

**Ví dụ:**
- 14:00 - User "Nguyễn Văn A" gửi: "Xin chào"
- 14:01 - Cùng user cố gắng gửi: "Xin chào" lại
- ❌ Error: "Bạn vừa gửi lời nhắn này 1 phút trước"

### Gợi ý:

1. Trong `app/guestbook/actions.ts`, thêm checking:
   - Tìm entry cuối cùng của user này
   - So sánh name và message
   - So sánh timestamp (trong 60 giây?)

2. Sử dụng `Array.find()` hoặc `Array.findIndex()`

3. Thêm error message mới vào `ActionState` interface

### Bắt đầu:

```typescript
// app/guestbook/actions.ts

export async function createGuestbookEntry(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    name: formData.get("name") as string,
    message: formData.get("message") as string,
  };

  // Validate schema
  const result = guestbookSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  // ← THÊM CHECK DUPLICATE VÀO ĐÂY
  // Tìm entry gần nhất từ cùng user
  const lastEntry = guestbookEntries.find(
    (entry) => entry.name === result.data.name
  );

  if (lastEntry && lastEntry.message === result.data.message) {
    const timeDiff = Date.now() - parseInt(lastEntry.id);
    const secondsDiff = Math.floor(timeDiff / 1000);

    if (secondsDiff < 60) {
      return {
        success: false,
        errors: {
          message: [
            `Bạn vừa gửi lời nhắn này ${secondsDiff} giây trước. Vui lòng chờ ${60 - secondsDiff}s nữa.`,
          ],
        },
      };
    }
  }

  // Thêm entry mới
  const newEntry = { /* ... */ };
  guestbookEntries.unshift(newEntry);
  revalidatePath("/guestbook");

  return { success: true };
}
```

### ⭐ Chi Tiết:

1. **`guestbookEntries.find(...)`** - Tìm entry đầu tiên match condition
2. **`Date.now() - parseInt(lastEntry.id)`** - ID là timestamp, nên có thể dùng để tính thời gian
3. **`/ 1000`** - Convert từ milliseconds → seconds
4. **Error message dynamics** - Hiển thị "Vui lòng chờ X giây nữa"

### Solution:

```typescript
const createGuestbookEntry = async (
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const rawData = {
    name: formData.get("name") as string,
    message: formData.get("message") as string,
  };

  const result = guestbookSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  // Kiểm tra duplicate trong 60 giây
  const lastEntry = guestbookEntries.find(
    (entry) => entry.name === result.data.name && 
               entry.message === result.data.message
  );

  if (lastEntry) {
    const now = Date.now();
    const lastTime = parseInt(lastEntry.id);
    const elapsedSeconds = Math.floor((now - lastTime) / 1000);

    if (elapsedSeconds < 60) {
      const remainingSeconds = 60 - elapsedSeconds;
      return {
        success: false,
        errors: {
          message: [
            `Bạn vừa gửi lời nhắn này. Vui lòng chờ ${remainingSeconds}s nữa trước khi gửi lại.`,
          ],
        },
      };
    }
  }

  const newEntry = {
    id: Date.now().toString(),
    name: result.data.name,
    message: result.data.message,
    createdAt: new Date().toISOString(),
  };

  guestbookEntries.unshift(newEntry);
  revalidatePath("/guestbook");

  return { success: true };
};
```

### Kiểm tra:

1. Mở http://localhost:3001/guestbook
2. Gửi: Name="Test", Message="Hello"
3. Cố gắng gửi lại ngay → Error: "Bạn vừa gửi lời nhắn này. Vui lòng chờ 59s nữa"
4. Chờ 1 phút, gửi lại → OK
5. Commit: `git add . ; git commit -m "feat: thêm validation duplicate entry trong 60s"`

---

## 🎯 Bài 3: Custom Hook - useFormStatus()

### Yêu cầu:

Tìm hiểu về React hook `useFormStatus()` (React 19 + Next.JS) - một hook hiện đại hơn `useActionState` cho việc quản lý form state.

**Mục tiêu:**
- Tạo một Guestbook Form component sử dụng `useFormStatus()` thay vì `useActionState()`
- So sánh 2 cách tiếp cận

### Khác Biệt:

```typescript
// CÁCH 1: useActionState (hiện tại)
const [state, formAction, isPending] = useActionState(createEntry, initialState);
// Trả về: state, formAction, isPending

// CÁCH 2: useFormStatus (mới)
const { pending, data } = useFormStatus();
// useFormStatus() không nhận parameters
// Nó tự động detect parent <form> và lấy status từ đó
```

### useFormStatus() Mechanics:

```typescript
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending, data } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Đang gửi..." : "Gửi"}
    </button>
  );
}
```

### Ưu điểm:

- Tách button component → reusable
- Tự động detect form status
- Không cần truyền state xuyên qua props

### Nhược điểm:

- Không có error state như `useActionState`
- Phải quản lý error/success từ form parent

### Bắt Đầu:

1. **Tạo file `components/guestbook-form-v2.tsx`** - sử dụng `useFormStatus()`

```typescript
"use client";

import { createGuestbookEntry } from "@/app/guestbook/actions";
import SubmitButton from "@/components/submit-button";
import { useActionState } from "react"; // Vẫn cần cho error handling

const initialState = { success: false };

export default function GuestbookFormV2() {
  const [state, formAction] = useActionState(createGuestbookEntry, initialState);

  return (
    <form action={formAction} className="bg-gray-50 rounded-lg p-6 space-y-4">
      <div>
        <label>Tên của bạn</label>
        <input name="name" type="text" />
        {state.errors?.name && (
          <p className="text-red-500">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label>Lời nhắn</label>
        <textarea name="message" />
        {state.errors?.message && (
          <p className="text-red-500">{state.errors.message[0]}</p>
        )}
      </div>

      {/* ← Sử dụng SubmitButton component thay vì <button> trực tiếp */}
      <SubmitButton />

      {state.success && <p className="text-green-600">Thành công!</p>}
    </form>
  );
}
```

2. **Tạo file `components/submit-button.tsx`**

```typescript
"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
    >
      {pending ? "Đang gửi..." : "Gửi lời nhắn"}
    </button>
  );
}
```

### Solution:

Xem cách implement trong:
- `components/submit-button.tsx` (SubmitButton component)
- `components/guestbook-form-v2.tsx` (Form using useFormStatus)

### So sánh Code:

```typescript
// TRƯỚC (useActionState):
<button type="submit" disabled={isPending}>
  {isPending ? "Đang gửi..." : "Gửi"}
</button>

// SAU (useFormStatus):
// SubmitButton.tsx
const { pending } = useFormStatus();
// Không cần pass props!
```

### Kiểm tra:

1. Tạo `app/guestbook/v2.tsx` để test form mới (hoặc thêm switch)
2. So sánh code giữa v1 (useActionState) vs v2 (useFormStatus)
3. Kiểm tra cả 2 cách hoạt động giống nhau
4. Commit: `git add . ; git commit -m "feat: thêm useFormStatus hook alternative"`

---

## 📊 Comparison Table

| Bài | Chủ Đề | Độ Khó | Thời Gian | Kỹ Năng |
|----|----|-----|----|-----|
| 1 | Reset Form | ⭐⭐ | 10 min | State management |
| 2 | Duplicate Validation | ⭐⭐⭐ | 20 min | Validation logic |
| 3 | useFormStatus() | ⭐⭐ | 15 min | React hooks |

---

## 🎓 Learning Path

**Bắt Đầu:**
1. Làm **Bài 1** - Quen với form reset
2. Làm **Bài 3** - Học useFormStatus hook
3. Làm **Bài 2** - Advanced validation logic

**Hoặc:**
1. Làm theo thứ tự: 1 → 2 → 3
2. Mỗi bài commit riêng

---

## ✅ Checklist Hoàn Tất

- [ ] **Bài 1:** "Gửi tin nhắn khác" button hoạt động
  - [ ] Success message hiển thị
  - [ ] Button click → form reset
  - [ ] Commit: feat/exercise-1

- [ ] **Bài 2:** Duplicate validation
  - [ ] Không cho phép duplicate trong 60s
  - [ ] Error message hiển thị thời gian chờ
  - [ ] Commit: feat/exercise-2

- [ ] **Bài 3:** useFormStatus hook
  - [ ] SubmitButton component tạo
  - [ ] GuestbookFormV2 hoạt động
  - [ ] So sánh với v1
  - [ ] Commit: feat/exercise-3

---

## 🚀 Tiếp Theo

Sau khi hoàn tất 3 bài:

1. Quay trở lại **Phần 5** để học **shadcn/ui** components
2. Hoặc khám phá thêm:
   - `useOptimistic()` hook - Optimistic UI updates
   - `useTransition()` hook - Async transitions
   - Middleware - Request/Response middleware pattern
   - Database integration - Lưu data vào database thật

---

## 💡 Tips & Tricks

### Tip 1: Testing Progressive Enhancement

```bash
# Disable JavaScript trong DevTools:
Ctrl+Shift+P → Type "disable"
Chọn "Disable JavaScript"

# Form vẫn hoạt động? ✅
# Không hoạt động? ❌ Kiểm tra form attributes
```

### Tip 2: Debug Zod Errors

```typescript
const result = contactSchema.safeParse(data);
if (!result.success) {
  console.log(result.error.flatten().fieldErrors);
  // In ra object các errors per field
}
```

### Tip 3: Tạo Reusable Validation Schema

```typescript
// schemas.ts
export const nameSchema = z.string().min(2).max(50);
export const emailSchema = z.string().email();

// actions.ts
export const guestbookSchema = z.object({
  name: nameSchema,
  email: emailSchema, // Reuse
});
```

---

## 🤔 Troubleshooting

**Q: Bài 1 - formKey không work?**
A: Ensure form key là number và increment. Nếu string sẽ không re-mount.

**Q: Bài 2 - Duplicate check không work?**
A: Check xem ID là timestamp không? `parseInt(lastEntry.id)` cần valid.

**Q: Bài 3 - useFormStatus không nhận props?**
A: Đúng, nó tự động detect parent form. Không cần pass `formAction`.
