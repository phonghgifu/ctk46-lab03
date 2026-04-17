"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        ⚠️ Đã xảy ra lỗi!
      </h1>
      <p className="text-gray-600 mb-6 text-lg">
        {error.message || "Một điều gì đó không ổn. Vui lòng thử lại sau."}
      </p>
      <details className="bg-gray-50 rounded-lg p-4 mb-6 text-left max-w-2xl mx-auto">
        <summary className="cursor-pointer font-semibold text-gray-700">Chi tiết lỗi</summary>
        <pre className="mt-4 text-sm text-gray-600 whitespace-pre-wrap break-words">
          {error.digest && `Digest: ${error.digest}\n`}
          {error.stack}
        </pre>
      </details>
      <button
        onClick={() => reset()}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        Thử lại
      </button>
    </div>
  );
}
