# Phần 5: shadcn/ui Component Library & Pokemon API Integration

## 📋 Mục tiêu bài học

Trong phần này, chúng ta sẽ:
1. Hiểu về shadcn/ui và cách tích hợp vào Next.JS
2. Tạo và sử dụng shadcn/ui components
3. Xây dựng Pokemon API integration với Server Components
4. Nâng cấp guestbook form với shadcn/ui components
5. Xử lý async operations và error boundaries

---

## 🎨 Phần 1: Giới thiệu shadcn/ui

### shadcn/ui là gì?

**shadcn/ui** là một bộ sưu tập component React được xây dựng trên Radix UI và Tailwind CSS. Khác với các component library khác:

- ❌ **Không phải npm package** - Bạn **copy-paste code**, không install package
- ✅ **Full control** - Tất cả code ở trong project của bạn
- ✅ **Tailwind CSS** - Tất cả styling dùng Tailwind, dễ customize
- ✅ **TypeScript** - Type-safe components
- ✅ **Accessibility** - Accessibility built-in

### Tại sao dùng shadcn/ui?

```
So sánh với Material-UI, Chakra UI:
┌─────────────────┬──────────────┬───────────────┬─────────────────┐
│                 │ shadcn/ui    │ Material-UI   │ Chakra UI       │
├─────────────────┼──────────────┼───────────────┼─────────────────┤
│ Bundle size     │ 📦 Nhỏ       │ 📦📦 Lớn      │ 📦📦 Lớn        │
│ Customization   │ ✅ Dễ       │ ❌ Khó       │ ✅ Trung bình   │
│ Tailwind        │ ✅ Native    │ ⚠️ Thêm CSS  │ ⚠️ CSS-in-JS    │
│ TypeScript      │ ✅ Full      │ ✅ Full      │ ⚠️ Partial      │
│ Learning curve  │ ✅ Thấp     │ ❌ Cao       │ ✅ Thấp        │
└─────────────────┴──────────────┴───────────────┴─────────────────┘
```

---

## 🛠️ Phần 2: Cấu hình shadcn/ui

### Step 1: Tạo components.json

```json
// components.json - Cấu hình shadcn/ui
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "baseColor": "neutral",
  "cssVariables": true,
  "aliases": {
    "@": ".",
    "@/components/ui": "./components/ui",
    "@/lib/utils": "./lib/utils"
  }
}
```

**Giải thích cấu hình:**

| Tùy chọn | Ý nghĩa |
|----------|---------|
| `style: "default"` | Dùng styling mặc định |
| `rsc: true` | React Server Components support |
| `tsx: true` | Dùng TypeScript |
| `baseColor: "neutral"` | Dùng bảng màu neutral |
| `cssVariables: true` | Dùng CSS variables cho theme |
| `aliases` | Path shortcuts trong import |

### Step 2: Tạo lib/utils.ts

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Giải thích:**

```javascript
// cn() helper function giúp merge Tailwind classes một cách thông minh

// Ví dụ 1: Conditional classes
cn("px-4 py-2", isActive && "bg-blue-500")
// Output: "px-4 py-2 bg-blue-500" (nếu isActive = true)

// Ví dụ 2: Override classes (twMerge giải quyết)
cn("px-4 py-2", "px-6")
// Output: "py-2 px-6" (px-6 override px-4)

// Nếu không dùng cn(), Tailwind sẽ giữ cả hai:
"px-4 py-2 px-6"  // ❌ Không hoạt động đúng
```

### Step 3: Cài đặt dependencies

```bash
npm install clsx tailwind-merge
```

---

## 🧩 Phần 3: Tạo shadcn/ui Components

### Button Component

```typescript
// components/ui/button.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  variant: {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-100",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    ghost: "hover:bg-gray-100",
    link: "text-blue-600 underline-offset-4 hover:underline",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
  },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Button.displayName = "Button"

export { Button }
```

**Cách dùng:**

```jsx
import { Button } from "@/components/ui/button"

// Default variant
<Button>Click me</Button>

// Destructive variant
<Button variant="destructive">Delete</Button>

// Outline variant
<Button variant="outline">Cancel</Button>

// Size variants
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// Combined
<Button variant="secondary" size="lg" disabled>
  Loading...
</Button>
```

### Card Component

```typescript
// components/ui/card.tsx - Tương tự button, nhưng cho containers
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm",
      className
    )}
    {...props}
  />
))

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
```

**Cách dùng:**

```jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Tiêu đề</CardTitle>
  </CardHeader>
  <CardContent>
    Nội dung ở đây
  </CardContent>
</Card>
```

### Input, Textarea, Label, Badge Components

```typescript
// components/ui/input.tsx
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
))

// components/ui/textarea.tsx
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 resize-none",
      className
    )}
    ref={ref}
    {...props}
  />
))

// components/ui/label.tsx
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))

// components/ui/badge.tsx
function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        badgeVariants.variant[variant],
        className
      )}
      {...props}
    />
  )
}
```

---

## 🐍 Phần 4: Pokemon API Integration

### Step 1: TypeScript Types

```typescript
// types/pokemon.ts
export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  sprites: {
    front_default: string | null
    back_default: string | null
    front_shiny: string | null
    back_shiny: string | null
  }
  abilities: Array<{
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
    slot: number
  }>
  types: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>
  stats: Array<{
    base_stat: number
    effort: number
    stat: {
      name: string
      url: string
    }
  }>
}
```

### Step 2: Pokemon List Page (Server Component)

```typescript
// app/pokemon/page.tsx
import Link from "next/link"
import { PokemonListResponse, PokemonDetail } from "@/types/pokemon"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Fetch Pokemon list
async function getPokemonList(): Promise<PokemonListResponse> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0", {
    next: { revalidate: 60 }, // ISR - Revalidate every 60s
  })
  
  if (!res.ok) {
    throw new Error("Không thể tải danh sách Pokémon")
  }
  
  return res.json()
}

// Fetch single Pokemon details
async function getPokemonDetails(url: string): Promise<PokemonDetail> {
  const res = await fetch(url, {
    next: { revalidate: 60 },
  })
  
  if (!res.ok) {
    throw new Error("Không thể tải chi tiết Pokémon")
  }
  
  return res.json()
}

// Main component - Server Component
export default async function PokemonPage() {
  let pokemonList: PokemonListResponse | null = null
  let error: string | null = null

  try {
    pokemonList = await getPokemonList()
  } catch (err) {
    error = err instanceof Error ? err.message : "Lỗi không xác định"
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Pokédex</h1>
      <p className="text-gray-500 mb-8">
        Khám phá {pokemonList?.count} Pokémon từ PokéAPI
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pokemonList?.results.map((pokemon, index) => (
          <PokemonCard
            key={pokemon.name}
            name={pokemon.name}
            url={pokemon.url}
            index={index + 1}
          />
        ))}
      </div>
    </div>
  )
}

// Child component - cũng là Server Component
async function PokemonCard({
  name,
  url,
  index,
}: {
  name: string
  url: string
  index: number
}) {
  let details: PokemonDetail | null = null

  try {
    details = await getPokemonDetails(url)
  } catch (err) {
    console.error(`Error loading ${name}:`, err)
  }

  return (
    <Link href={`/pokemon/${name.toLowerCase()}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">
              #{index.toString().padStart(3, "0")}
            </Badge>
          </div>
          <CardTitle className="capitalize text-lg">{name}</CardTitle>
        </CardHeader>
        <CardContent>
          {details && details.sprites.front_default ? (
            <img
              src={details.sprites.front_default}
              alt={name}
              className="w-24 h-24 mx-auto mb-4"
            />
          ) : (
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          {details && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Loại:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {details.types.map((type) => (
                    <Badge key={type.type.name} variant="outline">
                      {type.type.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cao:</span>
                <span>{(details.height / 10).toFixed(1)}m</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
```

**Các concept quan trọng:**

1. **Server Components**: `async` function return JSX - tự động fetch data server-side
2. **Revalidation**: `next: { revalidate: 60 }` - ISR (Incremental Static Regeneration)
3. **Error Handling**: Try-catch + fallback UI
4. **Child Server Components**: `PokemonCard` cũng là Server Component, async
5. **Parallel Fetching**: 21 requests (1 list + 20 details) nhưng Turbopack optimize

### Step 3: Pokemon Detail Page (Dynamic Route)

```typescript
// app/pokemon/[id]/page.tsx
export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return {
    title: `${id.charAt(0).toUpperCase() + id.slice(1)} - Pokédex`,
  }
}

export default async function PokemonDetailPage({ params }: Props) {
  const { id } = await params
  let pokemon: PokemonDetail | null = null

  try {
    pokemon = await getPokemonDetail(id)
  } catch (err) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Lỗi: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/pokemon">
        <Button variant="outline" className="mb-6">
          ← Quay lại danh sách
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="capitalize text-2xl">
              #{pokemon.id.toString().padStart(3, "0")} - {pokemon.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pokemon.sprites.front_default && (
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-full h-64 object-contain bg-gray-100 rounded"
              />
            )}
            {/* Stats */}
          </CardContent>
        </Card>

        {/* Types, Abilities */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loại</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map((type) => (
                  <Badge key={type.type.name} variant="default">
                    {type.type.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Chỉ số chiến đấu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name}>
                <p className="text-sm capitalize mb-1">{stat.stat.name}</p>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{
                      width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-sm font-semibold">{stat.base_stat}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Step 4: Loading & Error States

```typescript
// app/pokemon/loading.tsx - Skeleton loader
export default function LoadingPokemon() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 bg-gray-50 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="w-24 h-24 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// app/pokemon/error.tsx - Error boundary
"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ErrorPokemon({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Pokemon page error:", error)
  }, [error])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Lỗi tải Pokédex</h1>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <p className="text-red-700 mb-4">Có lỗi xảy ra:</p>
        <p className="text-red-600 bg-white p-3 rounded mb-4 font-mono text-sm">
          {error.message}
        </p>
        <Button onClick={reset} variant="default">
          Thử lại
        </Button>
      </div>
    </div>
  )
}
```

---

## 🔄 Phần 5: Nâng cấp Guestbook Form

### Before (Styling thuần Tailwind)

```jsx
<form action={formAction} className="bg-gray-50 rounded-lg p-6 mb-8 space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Tên của bạn
    </label>
    <input
      type="text"
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  <button
    type="submit"
    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
  >
    Gửi
  </button>
</form>
```

### After (Dùng shadcn/ui components)

```jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

<Card className="mb-8">
  <CardHeader>
    <CardTitle>Viết lời nhắn</CardTitle>
  </CardHeader>
  <CardContent>
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên của bạn</Label>
        <Input id="name" name="name" placeholder="Nhập tên..." required />
        {state.errors?.name && (
          <p className="text-red-500 text-sm">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Lời nhắn</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Viết lời nhắn..."
          required
          rows={3}
        />
        {state.errors?.message && (
          <p className="text-red-500 text-sm">{state.errors.message[0]}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang gửi..." : "Gửi lời nhắn"}
      </Button>

      {state.success && (
        <p className="text-green-600 text-sm">
          Gửi lời nhắn thành công!
        </p>
      )}
    </form>
  </CardContent>
</Card>
```

**Lợi ích:**
- ✅ Consistent styling
- ✅ Better semantics (Label + Input)
- ✅ Reusable components
- ✅ Easier to maintain
- ✅ Professional appearance

---

## 📊 File Structure

```
ctk46-lab03/
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── label.tsx
│       ├── badge.tsx
│       └── separator.tsx
├── types/
│   └── pokemon.ts
├── app/
│   ├── pokemon/
│   │   ├── page.tsx (List)
│   │   ├── loading.tsx (Skeleton)
│   │   ├── error.tsx (Error boundary)
│   │   └── [id]/
│   │       ├── page.tsx (Detail)
│   │       └── loading.tsx (Loading skeleton)
│   ├── guestbook/
│   │   └── page.tsx (Cập nhật với shadcn)
│   └── contact/
│       └── page.tsx
├── lib/
│   └── utils.ts (cn() function)
└── components.json (shadcn config)
```

---

## 🧪 Test & Validation

### Test Pokemon List Page

1. Truy cập: `http://localhost:3001/pokemon`
2. Kiểm tra:
   - ✅ 20 Pokemon cards hiển thị
   - ✅ Mỗi card có: ID badge, tên, hình ảnh, loại, cao/nặng
   - ✅ Loading skeleton khi đang load
   - ✅ Responsive grid (1 cột mobile, 2 tablet, 4 desktop)

### Test Pokemon Detail Page

1. Click vào một Pokemon card
2. Kiểm tra:
   - ✅ URL là `/pokemon/{name}` (dynamic route)
   - ✅ Hiển thị chi tiết: ID, tên, hình ảnh, loại, khả năng
   - ✅ Stats chart (progress bars)
   - ✅ Nút "Quay lại" hoạt động
   - ✅ Error handling nếu API down

### Test Guestbook Form

1. Truy cập: `http://localhost:3001/guestbook`
2. Kiểm tra:
   - ✅ Card-based layout
   - ✅ Labels + Inputs với shadcn styling
   - ✅ Form validation (Zod)
   - ✅ Success message
   - ✅ Guestbook entries display trong Card components

---

## 🎯 Key Takeaways

### 1. Server Components vs Client Components

```typescript
// Server Component - fetch data
async function PokemonList() {
  const data = await fetch(...)
  return <div>{data}</div>
}

// Client Component - interactivity
"use client"
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### 2. shadcn/ui Benefits

- Copy-paste components = Full control
- All code in your project
- Easy to customize with Tailwind
- Type-safe with TypeScript
- Accessibility built-in

### 3. Error Boundaries

```typescript
// app/[path]/error.tsx - Catches errors in subtree
"use client"
export default function ErrorBoundary({ error, reset }) {
  return <button onClick={() => reset()}>Try again</button>
}
```

### 4. ISR (Incremental Static Regeneration)

```typescript
// Revalidate every 60 seconds
fetch(url, { next: { revalidate: 60 } })

// Or per page
export const revalidate = 60 // in page.tsx
```

---

## 📚 Bài tập

### Bài 1: Thêm Search Filter cho Pokemon List

Thêm input search để filter Pokemon theo tên:

```typescript
"use client"

export function PokemonSearch({ onSearch }) {
  return (
    <Input
      placeholder="Search Pokemon..."
      onChange={(e) => onSearch(e.target.value)}
    />
  )
}
```

### Bài 2: Thêm Favorites Feature

Thêm nút "Add to Favorites" dùng localStorage:

```typescript
"use client"

function PokemonCard({ pokemon }) {
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = () => {
    // Save to localStorage
    setIsFavorite(!isFavorite)
  }

  return (
    <Card>
      <Button onClick={toggleFavorite} variant="ghost">
        {isFavorite ? "❤️" : "🤍"}
      </Button>
    </Card>
  )
}
```

### Bài 3: Custom Badge Styling

Tạo custom badge variants cho mỗi Pokemon type:

```typescript
const typeColors = {
  fire: "bg-red-100 text-red-800",
  water: "bg-blue-100 text-blue-800",
  grass: "bg-green-100 text-green-800",
}

<Badge className={typeColors[type.type.name]}>
  {type.type.name}
</Badge>
```

---

## 🔗 Tài liệu tham khảo

- [shadcn/ui Docs](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [PokéAPI](https://pokeapi.co)
- [Next.JS Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
