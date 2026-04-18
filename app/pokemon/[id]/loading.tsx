export default function LoadingPokemonDetail() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="h-10 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 bg-gray-50 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="w-full h-64 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6 bg-gray-50 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
