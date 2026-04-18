export default function LoadingPokemon() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Pokédex</h1>
      </div>
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
  );
}
