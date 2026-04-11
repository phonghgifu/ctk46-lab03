import Link from "next/link";

export default async function CatchAllBlogPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-4">Catch-All Route Demo</h1>
      <p className="text-gray-600 mb-4">
        Bạn đang truy cập URL: <code className="bg-gray-100 px-2 py-1 rounded">/blog/{slug.join("/")}</code>
      </p>
      <p className="text-gray-600 mb-6">
        Catch-all route <code className="bg-gray-100 px-2 py-1 rounded">[...slug]</code> có thể nhận bất kỳ số segment nào.
      </p>
      <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left max-w-2xl mx-auto">
        <h2 className="font-semibold mb-3">Thông tin URL:</h2>
        <ul className="space-y-2 text-sm">
          <li><strong>Number of segments:</strong> {slug.length}</li>
          <li><strong>Segments:</strong> {JSON.stringify(slug)}</li>
          <li><strong>Full path:</strong> /blog/{slug.join("/")}</li>
        </ul>
      </div>
      <p className="text-gray-500 mb-6 text-sm">
        Thử truy cập: /blog/a/b/c, /blog/x/y/z/w để thấy catch-all route hoạt động!
      </p>
      <Link
        href="/blog"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
      >
        Quay lại Blog
      </Link>
    </div>
  );
}
