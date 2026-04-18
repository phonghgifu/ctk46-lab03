# Hướng Dẫn: Xem Chi Tiết Các Thay Đổi Phần 4

## 📍 File được Tạo Mới

### 1. **app/guestbook/actions.ts** (NEW)
**Vị trí:** Trong project → app/guestbook/actions.ts
**Kích thước:** 60 dòng
**Mục đích:** Server Actions với Zod validation

**Các hàm chính:**
- `createGuestbookEntry(prevState, formData)` - Tạo entry mới (dòng 26-56)
- `deleteGuestbookEntry(id)` - Xóa entry (dòng 58-68)

**Zod Schema (dòng 6-16):**
```typescript
const guestbookSchema = z.object({
  name: z.string().min(2, "...").max(50, "..."),
  message: z.string().min(1, "...").max(500, "..."),
});
```

---

### 2. **components/guestbook-form.tsx** (NEW)
**Vị trí:** components/guestbook-form.tsx
**Kích thước:** 50 dòng
**Mục đích:** Form component với useActionState

**Cấu trúc:**
- Import hooks (dòng 1-4)
- `initialState` (dòng 6-8)
- `useActionState()` hook (dòng 13-16)
- Form JSX (dòng 18-62)

**Ưu tiên:**
- `name="name"` input (dòng 24)
- `name="message"` textarea (dòng 35)
- Error display (dòng 28, 39)
- Loading state button (dòng 48)
- Success message (dòng 54)

---

### 3. **components/delete-button.tsx** (NEW)
**Vị trí:** components/delete-button.tsx
**Kích thước:** 15 dòng
**Mục đích:** Button component để xóa entry

**Chức năng:**
- Confirm dialog (dòng 9)
- Gọi deleteGuestbookEntry() Server Action (dòng 10)
- Red button styling (dòng 13-15)

---

### 4. **app/contact/actions.ts** (NEW)
**Vị trí:** app/contact/actions.ts
**Kích thước:** 45 dòng
**Mục đích:** Server Actions cho Contact form

**Zod Schema (dòng 5-18):**
```typescript
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
});
```

**Hàm chính:**
- `sendContactMessage(prevState, formData)` (dòng 23-50)
- Console log result (dòng 47)

---

## 🔄 File được Cập Nhật

### 5. **app/guestbook/page.tsx** (UPDATED)
**Trước:** 250 dòng, "use client" component
**Sau:** 40 dòng, Server Component (❌ không "use client")

**Các thay đổi chính:**
- **Xóa:** `"use client"` directive
- **Xóa:** 6x useState (entries, loading, error, etc.)
- **Xóa:** useEffect + fetchEntries()
- **Xóa:** handleSubmit() async function
- **Xóa:** handleDelete() logic
- **Xóa:** Phân trang logic
- **Thêm:** Import GuestbookForm & DeleteButton (dòng 2-3)
- **Thêm:** Direct access `const entries = guestbookEntries` (dòng 6)
- **Thêm:** Sử dụng <GuestbookForm /> component (dòng 12)
- **Thêm:** Sử dụng <DeleteButton /> component (dòng 28)

**Đơn giản hóa:**
```typescript
// TRƯỚC (250 dòng, use client):
"use client";
const [entries, setEntries] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => { fetchEntries(); }, []);

// SAU (40 dòng, Server Component):
import { guestbookEntries } from "@/data/guestbook";
const entries = guestbookEntries;
```

---

### 6. **app/contact/page.tsx** (UPDATED)
**Trước:** Static contact info page
**Sau:** Interactive contact form with Server Actions

**Thay đổi:**
- **Xóa:** Static "Lớp" và "Mã Sinh viên" info
- **Thêm:** `"use client"` directive
- **Thêm:** useActionState hook (dòng 6)
- **Thêm:** Grid layout: info (trái) + form (phải)
- **Thêm:** Success message display (dòng 23)
- **Thêm:** 4 input fields (name, email, subject, message)
- **Thêm:** Error display per field
- **Thêm:** Submit button with isPending state

**Layout Grid:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <div>Info side (1 col)</div>
  <div className="md:col-span-2">Form side (2 cols)</div>
</div>
```

---

## 🧪 Hướng Dẫn Test Chi Tiết

### **Test 1: Guestbook Validation - Tên Trống**
```bash
URL: http://localhost:3001/guestbook

Bước:
1. Để trống "Tên của bạn"
2. Nhập "Hello" vào "Lời nhắn"
3. Nhấn "Gửi lời nhắn"

Kết quả mong đợi:
✅ Hiển thị lỗi đỏ: "Tên phải có ít nhất 2 ký tự"
✅ Form không submit
```

### **Test 2: Guestbook Validation - Tên 1 ký tự**
```bash
Bước:
1. Nhập "A" vào "Tên của bạn"
2. Nhập "Hello" vào "Lời nhắn"
3. Nhấn "Gửi lời nhắn"

Kết quả:
✅ Lỗi: "Tên phải có ít nhất 2 ký tự"
```

### **Test 3: Guestbook Success**
```bash
Bước:
1. Nhập "Nguyễn Văn A" vào "Tên"
2. Nhập "Xin chào" vào "Lời nhắn"
3. Nhấn "Gửi lời nhắn"

Kết quả:
✅ Button chuyển thành "Đang gửi..."
✅ Entry mới hiển thị ngay ở đầu list
✅ Form reset (trống)
✅ Thông báo xanh: "Gửi lời nhắn thành công!"
✅ Số "lời nhắn" tăng +1
```

### **Test 4: Guestbook Delete**
```bash
Bước:
1. Nhấn "Xóa" trên một entry

Kết quả:
✅ Confirm dialog: "Bạn có chắc muốn xóa lời nhắn này?"
✅ Nếu nhấn OK:
   - Entry bị xóa ngay
   - Số "lời nhắn" giảm -1
✅ Nếu nhấn Cancel:
   - Không xảy ra gì
```

### **Test 5: Contact Validation - Email**
```bash
URL: http://localhost:3001/contact

Bước:
1. Nhập hợp lệ: Tên, Email sai (vd: "abc"), Subject, Message
2. Nhấn "Gửi tin nhắn"

Kết quả:
✅ Lỗi đỏ: "Email không hợp lệ"
```

### **Test 6: Contact Validation - Subject**
```bash
Bước:
1. Subject = "Hi" (< 5 ký tự)
2. Nhấn "Gửi"

Kết quả:
✅ Lỗi: "Tiêu đề phải có ít nhất 5 ký tự"
```

### **Test 7: Contact Success**
```bash
Bước:
1. Nhập hợp lệ:
   - Tên: "Nguyễn Văn A"
   - Email: "a@gmail.com"
   - Tiêu đề: "Hợp tác"
   - Nội dung: "Xin chào tôi muốn hợp tác"
2. Nhấn "Gửi tin nhắn"

Kết quả:
✅ Form được thay bằng success message
✅ Message: "Gửi thành công! Cảm ơn bạn đã liên hệ."
✅ Terminal log:
   "Tin nhắn liên hệ mới: {
     name: 'Nguyễn Văn A',
     email: 'a@gmail.com',
     subject: 'Hợp tác',
     message: 'Xin chào tôi muốn hợp tác'
   }"
```

---

## 🔍 Cách Xem Code Changes trong Git

### **1. Xem tất cả thay đổi**
```bash
git log --oneline -5
# d7f2d91 feat: thêm Server Actions...
# 49c5582 docs: thêm hướng dẫn...

git show d7f2d91 # Xem chi tiết commit
```

### **2. Xem file nào đã thay đổi**
```bash
git diff HEAD~1 --stat
# app/contact/actions.ts (new)
# app/contact/page.tsx (modified)
# app/guestbook/actions.ts (new)
# components/delete-button.tsx (new)
# components/guestbook-form.tsx (new)
```

### **3. Xem diff chi tiết một file**
```bash
git diff HEAD~1 app/guestbook/page.tsx
# Hiển thị: xóa những dòng cũ (- đỏ), thêm dòng mới (+ xanh)
```

### **4. Xem file trước/sau**
```bash
# File cũ (Phần 3):
git show HEAD~1:app/guestbook/page.tsx

# File mới (Phần 4):
git show HEAD:app/guestbook/page.tsx
```

---

## 📊 Thống Kê Thay Đổi

```
Phần 4 Commit (d7f2d91):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files:    8 files changed
Lines:    +404 insertions, -240 deletions
New:      4 files
Modified: 4 files

Breakdown:
✨ NEW FILES:
   └─ app/guestbook/actions.ts (+60 lines)
   └─ app/contact/actions.ts (+45 lines)
   └─ components/guestbook-form.tsx (+50 lines)
   └─ components/delete-button.tsx (+15 lines)
   Total NEW: +170 lines

📝 MODIFIED FILES:
   └─ app/guestbook/page.tsx (-210 +40 = 70% giảm)
   └─ app/contact/page.tsx (+140)
   └─ package.json (+1, thêm zod)
   └─ other (+...)
   Total MODIFIED: +234 lines

TỔNG: +404 -240 (net: +164 lines)
```

---

## 🎯 Điểm Cần Lưu Ý Khi Trình Bày

### **1. Giải Thích "use server" Directive**
```typescript
// File có "use server" ở đầu = Tất cả code chạy trên server
"use server";

export async function createGuestbookEntry(...) {
  // Đoạn code này KHÔNG được gửi sang client
  // Không bao giờ expose secrets/private keys
}
```

### **2. So Sánh Phần 3 vs Phần 4**
- **Phần 3:** API Route chạy trên server, client gọi fetch
- **Phần 4:** Server Action chạy trên server, form tự động gọi

```typescript
// PHẦN 3:
const res = await fetch('/api/guestbook', { method: 'POST' });

// PHẦN 4:
<form action={serverAction}> {/* Tự động gọi */}
```

### **3. Zod Schema Nested Structure**
```typescript
// Zod schema là object mapping:
z.object({
  field1: z.string().min(2),
  field2: z.string().email(),
})

// Error format:
{
  success: false,
  error: {
    fieldErrors: {
      field1: ["Tên phải có ít nhất 2 ký tự"],
      field2: ["Email không hợp lệ"],
    }
  }
}
```

### **4. Progressive Enhancement Test**
```bash
# Disable JavaScript trong DevTools:
Ctrl+Shift+P → "Disable JavaScript"

# Thử submit form → vẫn hoạt động!
# Vì Server Action được gọi trực tiếp từ HTML form
```

### **5. revalidatePath() Mechanics**
```typescript
// Sau khi thêm entry:
revalidatePath("/guestbook");

// Next.JS sẽ:
// 1. Xóa cache trang /guestbook
// 2. Request tiếp theo sẽ fetch data mới
// 3. Server Component re-render
// 4. Client UI update
```

---

## 🚀 Xem Trực Tiếp Interface

### **URLs để test:**
```
Guestbook:  http://localhost:3001/guestbook
Contact:    http://localhost:3001/contact
Blog:       http://localhost:3001/blog (comparison)
```

### **Kiểm tra Server Actions:**
```bash
DevTools → Network → 
Xem requests tới: POST /_actions/...
```

---

## ✅ Checklist Khi Trình Bày

- [ ] Mở http://localhost:3001/guestbook
- [ ] Demo form validation error
- [ ] Demo form submit success
- [ ] Demo delete button
- [ ] Mở http://localhost:3001/contact
- [ ] Demo contact form validation
- [ ] Demo contact success + console log
- [ ] Giải thích "use server" directive
- [ ] So sánh với Phần 3
- [ ] Nêu ưu điểm Server Actions
- [ ] Show code changes trong VS Code
- [ ] Commit hash: d7f2d91
