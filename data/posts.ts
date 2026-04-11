export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  author: string;
}

export const posts: Post[] = [
  {
    slug: "gioi-thieu-nextjs",
    title: "Giới thiệu Next.JS — Framework React phổ biến nhất",
    excerpt:
      "Tìm hiểu tại sao Next.JS là lựa chọn hàng đầu cho phát triển web hiện đại.",
    content: `Next.JS là một React framework mạnh mẽ được phát triển bởi Vercel. Nó cung cấp nhiều tính năng quan trọng như Server-Side Rendering (SSR), Static Site Generation (SSG), và App Router.

Một số ưu điểm nổi bật của Next.JS:
- Routing tự động dựa trên cấu trúc thư mục
- Hỗ trợ Server Components và Client Components
- Tối ưu hóa hình ảnh, font, và scripts tự động
- API Routes tích hợp
- Hỗ trợ TypeScript sẵn có

Với App Router mới (từ Next.JS 13+), việc tạo routes trở nên đơn giản và linh hoạt hơn bao giờ hết.`,
    date: "2025-01-15",
    category: "Công nghệ",
    author: "Ngô Văn Phong",
  },
  {
    slug: "hoc-tailwind-css",
    title: "Tailwind CSS — Cách tiếp cận mới cho CSS",
    excerpt:
      "Khám phá phương pháp utility-first CSS và tại sao nó thay đổi cách viết CSS.",
    content: `Tailwind CSS là một utility-first CSS framework, nghĩa là thay vì viết CSS tùy chỉnh, bạn sử dụng các class tiện ích có sẵn để xây dựng giao diện.

Ví dụ, thay vì viết:
.card { padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

Bạn viết trực tiếp trong HTML:
<div class="p-4 rounded-lg shadow-md">...</div>

Ưu điểm:
- Không cần đặt tên class
- Không cần chuyển qua lại giữa file HTML và CSS
- File CSS cuối cùng rất nhỏ (chỉ chứa class đã dùng)
- Tạo giao diện nhất quán và có khả năng bảo trì cao`,
    date: "2025-01-20",
    category: "Công nghệ",
    author: "Ngô Văn Phong",
  },
  {
    slug: "kinh-nghiem-hoc-lap-trinh",
    title: "Chia sẻ kinh nghiệm tự học lập trình hiệu quả",
    excerpt:
      "Những bài học rút ra sau 3 năm tự học lập trình ở đại học.",
    content: `Sau 3 năm học tập và thực hành lập trình, tôi rút ra một số kinh nghiệm quan trọng:

1. Thực hành nhiều hơn đọc lý thuyết
Lập trình là kỹ năng thực hành. Đọc sách và xem video chỉ chiếm 30%, 70% còn lại là viết code.

2. Xây dựng dự án thực tế
Không gì tốt hơn việc xây dựng một sản phẩm thực tế để học. Hãy bắt đầu từ những dự án nhỏ và tăng dần độ phức tạp.

3. Tham gia cộng đồng
Tham gia các cộng đồng lập trình để học hỏi và chia sẻ kinh nghiệm với những người khác có cùng sở thích.

4. Đừng sợ lỗi
Lỗi là một phần quan trọng của quá trình học. Hãy coi debug như một kỹ năng cần phải rèn luyện.`,
    date: "2025-02-01",
    category: "Học tập",
    author: "Ngô Văn Phong",
  },
  {
    slug: "typescript-cac-tip-hay",
    title: "TypeScript Tips & Tricks — Nâng cao kỹ năng",
    excerpt:
      "Các mẹo hữu ích khi làm việc với TypeScript để viết code an toàn hơn.",
    content: `TypeScript là một superset của JavaScript cung cấp kiểm tra kiểu (type checking) tại compile-time.

Dưới đây là một số tips hữu ích:

1. Sử dụng Union Types
type Status = "success" | "error" | "loading";

2. Interfaces vs Types
- Interfaces: Tập trung vào định nghĩa cấu trúc đối tượng
- Types: Linh hoạt hơn, có thể là primitives, unions, v.v.

3. Generics - Tạo code tái sử dụng
function getValue<T>(item: T[], index: number): T {
  return item[index];
}

4. Utility Types
- Partial<T>: Làm tất cả thuộc tính tùy chọn
- Pick<T, K>: Chọn một số thuộc tính từ type
- Record<K, T>: Tạo object với keys cụ thể`,
    date: "2025-02-10",
    category: "Công nghệ",
    author: "Ngô Văn Phong",
  },
  {
    slug: "phat-trien-web-2025",
    title: "Xu hướng phát triển web năm 2025",
    excerpt:
      "Những công nghệ và xu hướng mới mà lập trình viên web nên chú ý.",
    content: `Những xu hướng phát triển web trong năm 2025:

1. AI Integration Everywhere
Chatbots, code generation, image analysis — AI đang thay đổi cách chúng ta phát triển web.

2. Web3 & Blockchain
Smart contracts, NFTs, Decentralized apps vẫn tiếp tục phát triển.

3. Performance & Core Web Vitals
Google prioritize trang web nhanh. Optimize Largest Contentful Paint, Cumulative Layout Shift, FID.

4. Edge Computing
Chạy code gần người dùng hơn với Edge Functions (Vercel, Cloudflare).

5. React Server Components
Tối ưu hóa rendering, giảm JS sent to client.

6. Frameworks Evolution
Next.JS, Remix, SvelteKit tiếp tục cải thiện developer experience.

Nên theo dõi các blog tech, conferences để cập nhật thêm!`,
    date: "2025-02-15",
    category: "Công nghệ",
    author: "Ngô Văn Phong",
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
