'use client';

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">Về Tôi</h1>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Ngô Văn Phong</h2>
          <p className="text-gray-700">Sinh viên lớp CTK46A - MSSV: 2212440</p>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-3">Sở Thích</h3>
          <ul className="text-gray-700 space-y-2">
            <li>💻 Lập trình</li>
            <li>📚 Học tập công nghệ mới</li>
            <li>🧩 Giải quyết vấn đề</li>
            <li>🤝 Làm việc nhóm</li>
          </ul>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Kỹ Năng</h3>
          <p className="text-gray-700">JavaScript • React • Next.js • TypeScript • Git • Tailwind CSS</p>
        </div>
      </div>
    </main>
  );
}
