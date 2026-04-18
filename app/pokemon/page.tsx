import Link from "next/link";
import { PokemonListResponse, PokemonDetail } from "@/types/pokemon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getPokemonList(): Promise<PokemonListResponse> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0", {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Không thể tải danh sách Pokémon");
  }

  return res.json();
}

async function getPokemonDetails(url: string): Promise<PokemonDetail> {
  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Không thể tải chi tiết Pokémon");
  }

  return res.json();
}

export default async function PokemonPage() {
  let pokemonList: PokemonListResponse | null = null;
  let error: string | null = null;

  try {
    pokemonList = await getPokemonList();
  } catch (err) {
    error = err instanceof Error ? err.message : "Lỗi không xác định";
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Pokédex</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!pokemonList) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Pokédex</h1>
        <p className="text-gray-500">
          Khám phá {pokemonList.count} Pokémon từ PokéAPI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pokemonList.results.map((pokemon, index) => (
          <PokemonCard
            key={pokemon.name}
            name={pokemon.name}
            url={pokemon.url}
            index={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

async function PokemonCard({
  name,
  url,
  index,
}: {
  name: string;
  url: string;
  index: number;
}) {
  let details: PokemonDetail | null = null;

  try {
    details = await getPokemonDetails(url);
  } catch (err) {
    console.error(`Error loading ${name}:`, err);
  }

  return (
    <Link href={`/pokemon/${name.toLowerCase()}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">#{index.toString().padStart(3, "0")}</Badge>
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
              <div className="flex justify-between">
                <span className="text-gray-600">Nặng:</span>
                <span>{(details.weight / 10).toFixed(1)}kg</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
