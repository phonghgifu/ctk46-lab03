"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPokemon({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Pokemon page error:", error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Lỗi tải Pokédex</h1>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <p className="text-red-700 mb-4">
          Có lỗi xảy ra khi tải dữ liệu Pokémon:
        </p>
        <p className="text-red-600 bg-white p-3 rounded mb-4 font-mono text-sm">
          {error.message}
        </p>
        <Button onClick={reset} variant="default">
          Thử lại
        </Button>
      </div>
    </div>
  );
}
