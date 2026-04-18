import Link from "next/link";

interface CatchAllPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { slug } = await params;

  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-4">Catch-All Route Demo</h1>
      
      <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left max-w-2xl mx-auto">
        <p className="text-gray-700 mb-4">
          <strong>URL Pattern:</strong> /blog/[...slug]/page.tsx
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Current URL:</strong> /blog/{slug.join("/")}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Slug Array:</strong> {JSON.stringify(slug)}
        </p>
        
        <div className="bg-white rounded p-4 mt-4 font-mono text-sm">
          <p>Số segments: {slug.length}</p>
          {slug.map((segment, i) => (
            <p key={i}>slug[{i}] = "{segment}"</p>
          ))}
        </div>
      </div>

      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 font-semibold">
          💡 Sự khác biệt giữa [slug] và [...slug]:
        </p>
        <ul className="text-left max-w-2xl mx-auto mt-2 text-yellow-800 space-y-2 text-sm">
          <li><strong>[slug]:</strong> Bắt một segment - /blog/hello ✓, /blog/hello/world ✗</li>
          <li><strong>[...slug]:</strong> Bắt nhiều segments - /blog/hello ✓, /blog/hello/world ✓, /blog/a/b/c/d ✓</li>
        </ul>
      </div>

      <Link
        href="/blog"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
      >
        Quay lại Blog
      </Link>

      <div className="mt-8 text-gray-600">
        <p className="mb-3 font-semibold">Hãy thử các URLs:</p>
        <div className="space-y-2 text-sm">
          <p><Link href="/blog/a/b" className="text-blue-600 hover:underline font-mono">/blog/a/b</Link></p>
          <p><Link href="/blog/x/y/z/w" className="text-blue-600 hover:underline font-mono">/blog/x/y/z/w</Link></p>
          <p><Link href="/blog/hello/world/nextjs/tutorial" className="text-blue-600 hover:underline font-mono">/blog/hello/world/nextjs/tutorial</Link></p>
        </div>
      </div>
    </div>
  );
}
