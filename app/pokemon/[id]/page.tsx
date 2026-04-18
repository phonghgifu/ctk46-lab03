import Link from "next/link";
import { PokemonDetail } from "@/types/pokemon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

async function getPokemonDetail(id: string): Promise<PokemonDetail> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Không thể tải chi tiết Pokémon");
  }

  return res.json();
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return {
    title: `${id.charAt(0).toUpperCase() + id.slice(1)} - Pokédex`,
  };
}

export default async function PokemonDetailPage({ params }: Props) {
  const { id } = await params;
  let pokemon: PokemonDetail | null = null;
  let error: string | null = null;

  try {
    pokemon = await getPokemonDetail(id);
  } catch (err) {
    error = err instanceof Error ? err.message : "Lỗi không xác định";
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/pokemon">
          <Button variant="outline" className="mb-4">
            ← Quay lại
          </Button>
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/pokemon">
        <Button variant="outline" className="mb-6">
          ← Quay lại danh sách
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hình ảnh và thông tin cơ bản */}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Cao</p>
                <p className="text-lg font-semibold">
                  {(pokemon.height / 10).toFixed(1)}m
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Nặng</p>
                <p className="text-lg font-semibold">
                  {(pokemon.weight / 10).toFixed(1)}kg
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-gray-600 text-sm mb-2">Kinh nghiệm cơ sở</p>
              <p className="text-lg font-semibold">{pokemon.base_experience}</p>
            </div>
          </CardContent>
        </Card>

        {/* Loại, Khả năng, và Chỉ số */}
        <div className="space-y-6">
          {/* Loại */}
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

          {/* Khả năng */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Khả năng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className="flex items-center justify-between"
                  >
                    <span className="capitalize">{ability.ability.name}</span>
                    {ability.is_hidden && (
                      <Badge variant="secondary">Ẩn</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chỉ số chiến đấu */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Chỉ số chiến đấu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name}>
                <p className="text-gray-600 text-sm capitalize mb-1">
                  {stat.stat.name}
                </p>
                <div className="bg-gray-200 rounded-full h-2 mb-1">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
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

      {/* Hình ảnh khác */}
      {(pokemon.sprites.back_default ||
        pokemon.sprites.front_shiny ||
        pokemon.sprites.back_shiny) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hình ảnh khác</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pokemon.sprites.front_default && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Trước</p>
                  <img
                    src={pokemon.sprites.front_default}
                    alt="front"
                    className="w-full h-32 object-contain bg-gray-100 rounded"
                  />
                </div>
              )}
              {pokemon.sprites.back_default && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Sau</p>
                  <img
                    src={pokemon.sprites.back_default}
                    alt="back"
                    className="w-full h-32 object-contain bg-gray-100 rounded"
                  />
                </div>
              )}
              {pokemon.sprites.front_shiny && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Shiny Trước</p>
                  <img
                    src={pokemon.sprites.front_shiny}
                    alt="front_shiny"
                    className="w-full h-32 object-contain bg-gray-100 rounded"
                  />
                </div>
              )}
              {pokemon.sprites.back_shiny && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Shiny Sau</p>
                  <img
                    src={pokemon.sprites.back_shiny}
                    alt="back_shiny"
                    className="w-full h-32 object-contain bg-gray-100 rounded"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
