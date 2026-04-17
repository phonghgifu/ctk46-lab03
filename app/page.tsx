import Link from "next/link";

export default function HomePage() {
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.JS",
    "Tailwind CSS",
    "Node.js",
    "Git",
    "SQL",
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero section */}
      <div className="text-center mb-16">
        <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl font-bold text-blue-600">VP</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Xin chào! Tôi là{" "}
          <span className="text-blue-600">Ngô Văn Phong</span>
        </h1>
        <p className="text-lg text-gray-600 mb-3">
          MSSV: <strong>2212440</strong> — Lớp <strong>CTK46A</strong>
        </p>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Sinh viên Công nghệ Thông tin tại Đại học Đà Lạt. Đam mê phát triển
          web và khám phá các công nghệ mới.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/projects"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Xem dự án
          </Link>
          <Link
            href="/contact"
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Liên hệ
          </Link>
        </div>
      </div>

      {/* Skills section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Kỹ năng</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div
              key={skill}
              className="bg-gray-50 rounded-lg p-4 text-center hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <p className="font-semibold">{skill}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-50 rounded-2xl p-8 md:p-12 text-center border border-blue-100">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Đọc Blog của tôi</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Chia sẻ kiến thức và kinh nghiệm về lập trình, công nghệ web, và các
          bài học từ quá trình học tập.
        </p>
        <Link
          href="/blog"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Xem blog →
        </Link>
      </div>

      {/* Quick stats */}
      <div className="mt-16 grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-3xl font-bold text-blue-600">5+</p>
          <p className="text-gray-600">Bài viết Blog</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">4</p>
          <p className="text-gray-600">Dự án</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">8+</p>
          <p className="text-gray-600">Kỹ năng</p>
        </div>
      </div>
    </div>
  );
}
