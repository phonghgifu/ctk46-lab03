# Phần 5: XEM CHI TIẾT THAY ĐỔI - shadcn/ui & Pokemon API

## 📂 Cấu trúc Files Mới

### 1. shadcn/ui Components

Tất cả components được tạo trong `components/ui/`:

```
components/ui/
├── button.tsx          (40 lines) - Button variants: default, destructive, outline, ghost, link
├── card.tsx            (80 lines) - Card + CardHeader + CardTitle + CardDescription + CardContent + CardFooter
├── input.tsx           (20 lines) - Input field with focus & disabled states
├── textarea.tsx        (20 lines) - Textarea with resize-none
├── label.tsx           (15 lines) - Form label
├── badge.tsx           (25 lines) - Badge variants: default, secondary, outline, destructive
└── separator.tsx       (15 lines) - Horizontal/vertical separator
```

**Total: 215 lines of reusable component code**

### 2. Pokemon API

```
types/
└── pokemon.ts          (50 lines) - TypeScript interfaces for PokéAPI responses

app/pokemon/
├── page.tsx            (120 lines) - List page with Server Components
├── loading.tsx         (25 lines) - Skeleton loader
├── error.tsx           (30 lines) - Error boundary
└── [id]/
    ├── page.tsx        (200 lines) - Detail page with full Pokemon info
    └── loading.tsx     (30 lines) - Detail loading skeleton
```

**Total: 455 lines for Pokemon integration**

### 3. Updated Files

```
lib/
└── utils.ts            (5 lines) - cn() helper function

components/
├── guestbook-form.tsx  (50 lines) - Updated with shadcn components
└── navbar.tsx          (Modified) - Added Pokédex link

app/
├── guestbook/
│   └── page.tsx        (50 lines) - Updated with Card components
└── blog/
    └── [...slug]/
        └── page.tsx    (Fixed syntax error - removed duplicate code)

components.json         (New config file)
```

---

## 🔍 Chi tiết từng file

### 1. lib/utils.ts - Helper Function

**What changed:**

```typescript
// NEW: Helper function for merging Tailwind classes
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Why:**
- Merges conditional classes with clsx
- Resolves Tailwind conflicts with twMerge
- Used in all shadcn components

**Test:**
```typescript
cn("px-4 py-2", isActive && "bg-blue-500")  // ✅ Works
cn("px-4", "px-6")  // ✅ px-6 wins (twMerge)
```

---

### 2. components/ui/button.tsx - Button Component

**Key Features:**

```typescript
// Variants: default, destructive, outline, secondary, ghost, link
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
}

// Sizes: default, sm, lg
<Button variant="destructive" size="lg" disabled>
  Delete Account
</Button>
```

**Styling approach:**

```typescript
const buttonVariants = {
  variant: {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    // ... more variants
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
  },
}

// Uses cn() to merge base classes + variant classes
className={cn(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50",
  buttonVariants.variant[variant],
  buttonVariants.size[size],
  className
)}
```

**Test the component:**

```bash
# In browser dev tools console
> document.querySelector('button').className
"inline-flex items-center justify-center rounded-md text-sm font-medium ... bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
```

---

### 3. components/ui/card.tsx - Card Component

**Structure:**

```typescript
// Main container
<Card>
  {/* Header section */}
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>

  {/* Main content */}
  <CardContent>
    Your content here
  </CardContent>

  {/* Footer section */}
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

**Usage in Guestbook:**

```tsx
// Before: Plain div
<div className="border rounded-lg p-4">
  {entry.message}
</div>

// After: Card component
<Card>
  <CardContent className="pt-4">
    {entry.message}
  </CardContent>
</Card>
```

---

### 4. types/pokemon.ts - TypeScript Interfaces

**API Response Types:**

```typescript
export interface PokemonDetail {
  id: number                    // Pokemon ID
  name: string                  // Pokemon name
  height: number                // Height in decimeters
  weight: number                // Weight in hectograms
  base_experience: number       // XP reward
  sprites: {
    front_default: string | null
    back_default: string | null
    front_shiny: string | null
    back_shiny: string | null
  }
  abilities: PokemonAbility[]   // Abilities list
  types: PokemonType[]          // Type list (fire, water, etc)
  stats: PokemonStat[]          // Base stats
}

export interface PokemonType {
  slot: number
  type: {
    name: string                // fire, water, grass...
    url: string
  }
}

export interface PokemonStat {
  base_stat: number             // 0-255
  stat: {
    name: string                // hp, attack, defense...
    url: string
  }
}
```

**Why use TypeScript:**
- ✅ IDE autocomplete
- ✅ Type checking at compile-time
- ✅ Catch errors early
- ✅ Self-documenting code

**Test:**
```typescript
const pokemon: PokemonDetail = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  // ... TypeScript will show required fields
}
```

---

### 5. app/pokemon/page.tsx - List Page

**Server Component Pattern:**

```typescript
// Async function - runs on server
async function getPokemonList(): Promise<PokemonListResponse> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20", {
    next: { revalidate: 60 },  // ISR - cache 60 seconds
  })
  return res.json()
}

// Main component - also async
export default async function PokemonPage() {
  let pokemonList: PokemonListResponse | null = null
  let error: string | null = null

  try {
    pokemonList = await getPokemonList()
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error"
  }

  // Return error UI
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    )
  }

  // Return success UI
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {pokemonList?.results.map((pokemon, index) => (
        <PokemonCard key={pokemon.name} {...pokemon} index={index + 1} />
      ))}
    </div>
  )
}

// Child Server Component
async function PokemonCard({ name, url, index }) {
  // Can also be async!
  const details = await getPokemonDetails(url)

  return (
    <Link href={`/pokemon/${name.toLowerCase()}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <Badge variant="secondary">#{index.toString().padStart(3, "0")}</Badge>
          <CardTitle className="capitalize text-lg">{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <img src={details.sprites.front_default} alt={name} />
          <div className="flex flex-wrap gap-1">
            {details.types.map((type) => (
              <Badge key={type.type.name}>{type.type.name}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
```

**Key concepts:**
- ✅ `async` functions in components
- ✅ Fetch on server (no API key leak)
- ✅ ISR with `next: { revalidate: 60 }`
- ✅ Error handling with try-catch
- ✅ Child components also async

**Rendering flow:**

```
1. Browser requests /pokemon
2. Server runs PokemonPage() async function
3. getPokemonList() fetches from PokéAPI
4. For each Pokemon, getPokemonDetails() called
5. PokemonCard renders with data
6. HTML sent to browser
7. Browser receives full page (no JS needed!)
```

---

### 6. app/pokemon/[id]/page.tsx - Detail Page

**Dynamic Route Pattern:**

```typescript
// Dynamic parameter [id] matches /pokemon/bulbasaur, /pokemon/charmander, etc

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return {
    title: `${id.charAt(0).toUpperCase() + id.slice(1)} - Pokédex`,
  }
}

export default async function PokemonDetailPage({ params }: Props) {
  const { id } = await params  // "bulbasaur" from URL

  let pokemon: PokemonDetail | null = null
  let error: string | null = null

  try {
    // Fetch single Pokemon by name
    pokemon = await getPokemonDetail(id)
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error"
  }

  // Two-column layout
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left: Images & Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>
            #{pokemon.id} - {pokemon.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Images */}
          <img src={pokemon.sprites.front_default} />
          {/* Height, Weight, XP */}
        </CardContent>
      </Card>

      {/* Right: Types & Abilities */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <Badge key={type.type.name}>{type.type.name}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Abilities</CardTitle>
          </CardHeader>
          <CardContent>
            {pokemon.abilities.map((ability) => (
              <div key={ability.ability.name}>
                {ability.ability.name}
                {ability.is_hidden && <Badge>Hidden</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Stats visualization
  <Card>
    <CardHeader>
      <CardTitle>Stats</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 gap-4">
        {pokemon.stats.map((stat) => (
          <div key={stat.stat.name}>
            <p className="text-sm capitalize">{stat.stat.name}</p>
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
}
```

**URL matching:**
- `/pokemon/bulbasaur` → `params.id = "bulbasaur"`
- `/pokemon/charizard` → `params.id = "charizard"`
- `/pokemon/[id]` → Matches any Pokemon name

---

### 7. app/pokemon/loading.tsx - Skeleton Loader

**When shown:**
- User navigates to `/pokemon`
- Page is loading (initial page render)
- Shows immediately while data is being fetched

```typescript
export default function LoadingPokemon() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 bg-gray-50 animate-pulse">
          {/* Skeleton card */}
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="w-24 h-24 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

**CSS class `animate-pulse`:**
```css
/* Built-in Tailwind animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

### 8. app/pokemon/error.tsx - Error Boundary

**When shown:**
- Error thrown in `/pokemon` or child pages
- API request fails
- Exception caught by error boundary

```typescript
"use client"  // Must be Client Component!

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ErrorPokemon({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void  // Function to retry
}) {
  useEffect(() => {
    console.error("Pokemon page error:", error)
  }, [error])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Lỗi tải Pokédex</h1>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 mb-4">Có lỗi xảy ra:</p>
        <p className="text-red-600 bg-white p-3 rounded mb-4 font-mono text-sm">
          {error.message}
        </p>
        {/* Retry button - re-render the component */}
        <Button onClick={reset} variant="default">
          Thử lại
        </Button>
      </div>
    </div>
  )
}
```

**Error boundary rules:**
- Must be `"use client"` directive
- Receives `error` and `reset` props
- `reset()` re-tries the page render
- Catches errors in subtree components

---

### 9. components/guestbook-form.tsx - Updated with shadcn

**Before:**

```jsx
<form className="bg-gray-50 rounded-lg p-6 space-y-4">
  <input
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Nhập tên..."
  />
  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
    Gửi
  </button>
</form>
```

**After:**

```jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
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
        <Input
          id="name"
          name="name"
          placeholder="Nhập tên của bạn"
          required
        />
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

**Changes:**
- ✅ Wrapped in Card for consistent layout
- ✅ Used Label + Input components (better semantics)
- ✅ Input spacing with `space-y-2` container
- ✅ Button with disabled state
- ✅ Consistent error display

---

### 10. app/guestbook/page.tsx - Updated to use Cards

**Before:**

```jsx
{entries.map((entry) => (
  <div key={entry.id} className="border rounded-lg p-4 hover:shadow-sm">
    <span className="font-semibold">{entry.name}</span>
    <p className="text-gray-600">{entry.message}</p>
  </div>
))}
```

**After:**

```jsx
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

<Separator className="my-8" />

<div className="space-y-4">
  {entries.map((entry) => (
    <Card key={entry.id}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-800">{entry.name}</span>
          <span className="text-xs text-gray-400">
            {new Date(entry.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <p className="text-gray-600">{entry.message}</p>
      </CardContent>
    </Card>
  ))}
</div>
```

**Changes:**
- ✅ Card + CardContent components
- ✅ Separator for visual divide
- ✅ Better spacing and layout
- ✅ Date formatting

---

### 11. components/navbar.tsx - Added Pokédex Link

**New link added:**

```jsx
<Link
  href="/pokemon"
  className="text-gray-600 hover:text-blue-600 transition-colors"
>
  Pokédex
</Link>
```

**Navigation flow:**
```
Home → About → Blog → Projects → Skills → Lưu bút → Pokédex → Liên hệ
```

---

### 12. components.json - shadcn/ui Configuration

```json
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

**Configuration meanings:**

| Key | Value | Why |
|-----|-------|-----|
| `style` | `"default"` | Use default shadcn styling |
| `rsc` | `true` | React Server Components support |
| `tsx` | `true` | Use TypeScript |
| `baseColor` | `"neutral"` | Use neutral gray palette |
| `cssVariables` | `true` | Use CSS variables for theme |
| `aliases` | Path mappings | Shortcuts for imports |

---

## 🧪 Testing Guide

### Test Pokemon List Page

```bash
# 1. Visit page
http://localhost:3001/pokemon

# 2. Verify:
- 20 Pokemon cards visible
- Grid layout (4 cols on desktop)
- Each card shows: ID, name, image, types, height
- Skeleton loader appears while loading
- No errors in console

# 3. Click a Pokemon
- URL changes to /pokemon/bulbasaur
- Detail page loads
```

### Test Pokemon Detail Page

```bash
# 1. Visit specific Pokemon
http://localhost:3001/pokemon/charizard

# 2. Verify:
- Full Pokemon info displayed
- Types and abilities shown
- Stats with progress bars
- "Back" button works
- All 4 images displayed (front, back, shiny variants)

# 3. Test error handling
# In browser console:
fetch('https://pokeapi.co/api/v2/pokemon/invalid')
  .then(r => r.json())
  .catch(e => console.log(e))
  // Should show "Not found" error
```

### Test Guestbook Form

```bash
# 1. Visit guestbook
http://localhost:3001/guestbook

# 2. Verify:
- Form in Card container
- Label + Input styling
- Submit button
- Error messages show for invalid input

# 3. Submit form
- Entry appears in Card below
- Card styling consistent
- Date displayed correctly

# 4. Check DOM
# In browser dev tools:
document.querySelector('input[name="name"]').className
// Should include shadcn input classes
```

---

## 📊 Lines of Code Added

```
Components:      215 lines (shadcn/ui)
Pokemon API:     455 lines (types + pages)
Updated:         150 lines (form + navbar)
Documentation:  2000+ lines (guides + examples)
─────────────────────────
Total:          2820+ lines
```

---

## 🔄 Git Commit

```bash
git log --oneline | head -1
# b7e1977 feat: Phần 5 - shadcn/ui Components & Pokemon API Integration
```

**Files changed:**
- 20 files created
- 5 files modified
- 1396 insertions
- 83 deletions

---

## ✅ Validation Checklist

- ✅ All components compile (npm run build)
- ✅ No TypeScript errors
- ✅ Dev server runs (npm run dev)
- ✅ Pokemon list page loads
- ✅ Pokemon detail pages load
- ✅ Error boundaries work
- ✅ Loading states display
- ✅ Guestbook form updated
- ✅ Navigation updated
- ✅ Responsive design works
- ✅ All components in UI folder
- ✅ Types defined for Pokemon API
- ✅ ISR configured (60s revalidate)
- ✅ Commit pushed to GitHub
