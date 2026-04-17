import ThemeToggle from "@/components/theme-toggle";
import CopyButton from "@/components/copy-button";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Giới thiệu</h1>

      <div className="space-y-4 text-gray-700">
        <p>
          Xin chào! Tôi là <strong>Ngô Văn Phong</strong>, sinh viên năm 3
          ngành Công nghệ Thông tin tại Đại học Đà Lạt, lớp CTK46A.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Kỹ năng</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>JavaScript / TypeScript</li>
          <li>React & Next.JS</li>
          <li>Tailwind CSS</li>
          <li>Git & GitHub</li>
          <li>HTML & CSS</li>
          <li>Database & SQL</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Học vấn</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium">Đại học Đà Lạt</p>
          <p className="text-gray-500">Cử nhân Công nghệ Thông tin (2021 — 2025)</p>
          <p className="text-gray-500">Lớp: CTK46A</p>
          <p className="text-gray-500">MSSV: 2212440</p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Sở thích</h2>
        <p>
          Tôi đam mê phát triển web, học hỏi các công nghệ mới, giải quyết các bài toán thú vị,
          và chia sẻ kiến thức với cộng đồng.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Liên hệ</h2>
        <div className="flex gap-4 items-center">
          <CopyButton text="phong.ng.2212440@gmail.com" label="📋 Copy Email" />
          <span className="text-gray-600">phong.ng.2212440@gmail.com</span>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Cài đặt giao diện</h2>
        <div className="flex gap-4 items-center">
          <span className="text-gray-600">Chế độ:</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
