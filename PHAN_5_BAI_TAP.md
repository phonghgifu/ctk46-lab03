# Phần 5: BÀI TẬP - shadcn/ui & Pokemon API

## 📌 Hướng dẫn chung

Tất cả bài tập dưới đây dựa trên code trong Phần 5. Mỗi bài tập bao gồm:

1. **Yêu cầu** - Cần làm gì
2. **Hints** - Gợi ý thực hiện
3. **Solution** - Code hoàn chỉnh
4. **Test cases** - Cách kiểm tra

---

## 🎯 Bài Tập 1: Thêm Search Filter cho Pokemon List

### Yêu cầu

Thêm ô tìm kiếm ở trên cùng trang Pokemon để lọc các Pokemon theo tên:

- Input field "Search Pokemon..."
- Lọc danh sách **real-time** (khi người dùng gõ)
- Reset khi xóa hết text
- Hiển thị số kết quả tìm được

**UI mockup:**

```
┌─ Pokédex ──────────────────────────────────┐
│ Search: [______________________]           │
│ Found 5 Pokemon                            │
│                                             │
│ ┌────────────┐ ┌────────────┐ ...         │
│ │ Bulbasaur  │ │ Charmander │             │
│ └────────────┘ └────────────┘             │
└─────────────────────────────────────────────┘
```

### Hints

1. **Use Client Component** - Cần `"use client"` vì có state
2. **useState** - Track search text
3. **Filter** - `array.filter(p => p.name.includes(search))`
4. **useCallback** - Optimize filter function

### Solution

**Step 1: Create new component**

```typescript
// components/pokemon-search.tsx
"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PokemonSearchProps {
  allPokemon: Array<{
    name: string
    url: string
  }>
  onFilter: (filtered: Array<{ name: string; url: string }>) => void
}

export function PokemonSearch({ allPokemon, onFilter }: PokemonSearchProps) {
  const [search, setSearch] = useState("")

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value)

      if (value.trim() === "") {
        onFilter(allPokemon)
      } else {
        const filtered = allPokemon.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(value.toLowerCase())
        )
        onFilter(filtered)
      }
    },
    [allPokemon, onFilter]
  )

  return (
    <div className="mb-6 space-y-2">
      <Label htmlFor="search">Search Pokemon</Label>
      <Input
        id="search"
        placeholder="Enter Pokemon name..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <p className="text-sm text-gray-500">
        Found {allPokemon.length} Pokemon{search && " matching your search"}
      </p>
    </div>
  )
}
```

**Step 2: Update page.tsx**

```typescript
// app/pokemon/page.tsx - Update to use search component

"use client"

import { useState } from "react"
import { PokemonSearch } from "@/components/pokemon-search"
import PokemonCard from "@/components/pokemon-card"
import { PokemonListResponse } from "@/types/pokemon"

interface Props {
  initialData: PokemonListResponse
}

export default function PokemonPageClient({
  initialData,
}: Props) {
  const [filteredPokemon, setFilteredPokemon] = useState(
    initialData.results
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Pokédex</h1>

      <PokemonSearch
        allPokemon={initialData.results}
        onFilter={setFilteredPokemon}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredPokemon.map((pokemon, index) => (
          <PokemonCard
            key={pokemon.name}
            name={pokemon.name}
            url={pokemon.url}
          />
        ))}
      </div>
    </div>
  )
}
```

**Step 3: Update parent page to fetch data**

```typescript
// app/pokemon/page.tsx - Server component
async function getPokemonList() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
  return res.json()
}

export default async function PokemonPage() {
  const data = await getPokemonList()
  return <PokemonPageClient initialData={data} />
}
```

### Test Cases

```bash
# Test 1: Search for "pika"
- Type "pika" in search box
- Should show: pikachu, pikipek (if in first 20)
- Count should update

# Test 2: Search for "fire"
- Type "fire" in search box
- No results (names don't match)
- Count: 0

# Test 3: Clear search
- Type something
- Delete all text
- List returns to full 20 Pokemon
```

---

## 🎯 Bài Tập 2: Thêm Pokemon Type Colors

### Yêu cầu

Customize Badge component để mỗi loại Pokemon (type) có màu khác nhau:

- Fire → Red
- Water → Blue
- Grass → Green
- Electric → Yellow
- Psychic → Purple
- ...etc

**UI mockup:**

```
Fire   [fire]
Water  [water]
Grass  [grass]
Electric [electric]
```

### Hints

1. **Color mapping** - Object with type name → Tailwind classes
2. **Dynamic className** - Use `cn()` to merge colors
3. **Update PokemonCard** - Pass type to get color

### Solution

**Step 1: Create type color constants**

```typescript
// constants/pokemon-types.ts
export const typeColors: Record<string, string> = {
  normal: "bg-gray-100 text-gray-800",
  fighting: "bg-orange-100 text-orange-800",
  flying: "bg-sky-100 text-sky-800",
  poison: "bg-purple-100 text-purple-800",
  ground: "bg-yellow-100 text-yellow-800",
  rock: "bg-slate-100 text-slate-800",
  bug: "bg-lime-100 text-lime-800",
  ghost: "bg-indigo-100 text-indigo-800",
  steel: "bg-zinc-100 text-zinc-800",
  fire: "bg-red-100 text-red-800",
  water: "bg-blue-100 text-blue-800",
  grass: "bg-green-100 text-green-800",
  electric: "bg-yellow-100 text-yellow-800",
  psychic: "bg-pink-100 text-pink-800",
  ice: "bg-cyan-100 text-cyan-800",
  dragon: "bg-indigo-100 text-indigo-800",
  dark: "bg-neutral-800 text-white",
  fairy: "bg-rose-100 text-rose-800",
}
```

**Step 2: Create TypeBadge component**

```typescript
// components/type-badge.tsx
import { Badge } from "@/components/ui/badge"
import { typeColors } from "@/constants/pokemon-types"

interface TypeBadgeProps {
  typeName: string
}

export function TypeBadge({ typeName }: TypeBadgeProps) {
  const color = typeColors[typeName.toLowerCase()] || typeColors.normal

  return (
    <Badge className={color} variant="outline">
      {typeName}
    </Badge>
  )
}
```

**Step 3: Update Pokemon card**

```typescript
// In app/pokemon/page.tsx
import { TypeBadge } from "@/components/type-badge"

// Inside PokemonCard render:
<div className="flex flex-wrap gap-1">
  {details.types.map((type) => (
    <TypeBadge key={type.type.name} typeName={type.type.name} />
  ))}
</div>
```

### Test Cases

```bash
# Test 1: Fire type Pokemon (Charmander)
- Navigate to /pokemon/charmander
- Type badge should be red

# Test 2: Water type Pokemon (Squirtle)
- Navigate to /pokemon/squirtle
- Type badge should be blue

# Test 3: Dual type Pokemon (Bulbasaur)
- Navigate to /pokemon/bulbasaur
- Should see green (grass) + purple (poison) badges
- Both with correct colors
```

---

## 🎯 Bài Tập 3: Thêm Favorite/Like Button

### Yêu cầu

Thêm nút "Like" (❤️) cho mỗi Pokemon card:

- Click nút để "Like" Pokemon
- Lưu vào `localStorage` (persist khi reload)
- Hiển thị danh sách Favorite Pokemon trên page mới
- Unike khi click lại

**UI:**

```
┌────────────────┐
│ #001 Bulbasaur │
│ ❤️  (Red heart) │  ← Like button
└────────────────┘

┌─ Favorites ─────┐
│ ❤️ (3) Favorites│
│ • Bulbasaur     │
│ • Charizard     │
│ • Blastoise     │
└─────────────────┘
```

### Hints

1. **useState** - Track favorites
2. **localStorage** - `localStorage.setItem("favorites", JSON.stringify(...))`
3. **useEffect** - Load favorites on mount
4. **New page** - `/pokemon/favorites`

### Solution

**Step 1: Create favorites hook**

```typescript
// hooks/usePokemonFavorites.ts
"use client"

import { useState, useEffect } from "react"

export function usePokemonFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pokemonFavorites")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage
  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      let updated: string[]

      if (prev.includes(name)) {
        updated = prev.filter((p) => p !== name)
      } else {
        updated = [...prev, name]
      }

      localStorage.setItem("pokemonFavorites", JSON.stringify(updated))
      return updated
    })
  }

  const isFavorite = (name: string) => favorites.includes(name)

  return { favorites, toggleFavorite, isFavorite, isLoaded }
}
```

**Step 2: Create LikeButton component**

```typescript
// components/pokemon-like-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { usePokemonFavorites } from "@/hooks/usePokemonFavorites"

interface PokemonLikeButtonProps {
  name: string
}

export function PokemonLikeButton({ name }: PokemonLikeButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = usePokemonFavorites()

  if (!isLoaded) {
    return <Button variant="ghost" disabled>...</Button>
  }

  const liked = isFavorite(name)

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => toggleFavorite(name)}
      className="text-lg"
    >
      {liked ? "❤️" : "🤍"}
    </Button>
  )
}
```

**Step 3: Update Pokemon card**

```typescript
// In app/pokemon/page.tsx
import { PokemonLikeButton } from "@/components/pokemon-like-button"

// Inside Card:
<div className="flex items-center justify-between">
  <CardTitle className="capitalize text-lg">{name}</CardTitle>
  <PokemonLikeButton name={name} />
</div>
```

**Step 4: Create favorites page**

```typescript
// app/pokemon/favorites/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("pokemonFavorites")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/pokemon">
        <Button variant="outline" className="mb-6">
          ← Back to Pokédex
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-4">
        ❤️ Favorites ({favorites.length})
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorites yet!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((name) => (
            <Link key={name} href={`/pokemon/${name}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <p className="font-semibold capitalize">{name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Test Cases

```bash
# Test 1: Add favorite
- Navigate to /pokemon
- Click heart on Bulbasaur
- Heart turns red ❤️
- Reload page → heart still red

# Test 2: Remove favorite
- Click red heart again
- Heart turns white 🤍
- Reload page → heart still white

# Test 3: Favorites page
- Navigate to /pokemon/favorites
- See list of liked Pokemon
- Count matches number of likes

# Test 4: Multiple favorites
- Like 5 Pokemon
- Go to /pokemon/favorites
- See all 5 listed
- Count shows "(5)"
```

---

## 📝 Submission Requirements

### For each exercise:

1. **Code files** - Updated files in repo
2. **Test results** - Screenshot or description of testing
3. **git commit** - With descriptive message

**Example commit:**

```bash
git add -A
git commit -m "feat: Bài tập Phần 5 #1 - Thêm Pokemon search filter

- Tạo PokemonSearch component
- Cập nhật page.tsx để dùng search
- Lọc danh sách real-time
- Hiển thị số kết quả"
```

---

## 🏆 Challenge Exercises

### Advanced: Multi-language Support

Dịch tất cả text sang tiếng Anh và tiếng Trung:

```typescript
const translations = {
  vi: { search: "Tìm kiếm", found: "Tìm thấy" },
  en: { search: "Search", found: "Found" },
  zh: { search: "搜索", found: "找到" },
}
```

### Advanced: Dark Mode Support

Thêm dark mode cho Pokemon cards:

```typescript
// components/ui/card.tsx - Update colors
dark:bg-slate-900 dark:text-slate-50 dark:border-slate-700
```

### Advanced: Sorting & Filtering

Thêm sort options:

- By ID (asc/desc)
- By Name (A-Z)
- By Height
- By Type

---

## 📚 Reference Materials

- [Next.JS Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [localStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [React hooks](https://react.dev/reference/react)
- [shadcn/ui components](https://ui.shadcn.com)

---

## ✅ Self-Check Rubric

| Criteria | ✅ Pass | ⚠️ Partial | ❌ Fail |
|----------|--------|-----------|--------|
| Code compiles | No errors | Minor warnings | Won't build |
| Functionality | Works perfectly | Works mostly | Broken |
| TypeScript | Full types | Some types | No types |
| Testing | All tests pass | Some pass | Not tested |
| Code quality | Clean, DRY | Repetitive | Messy |
| Documentation | Clear comments | Some docs | No docs |

---

## 🎓 Learning Outcomes

After completing these exercises, you should be able to:

✅ Create custom components with shadcn/ui
✅ Use localStorage for persistence
✅ Implement filtering/search functionality
✅ Build favorites feature
✅ Use TypeScript with React hooks
✅ Handle client-side state management
✅ Create new pages and routes
