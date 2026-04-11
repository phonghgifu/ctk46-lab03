export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  date: string;
  details: string;
}

export const projects: Project[] = [
  {
    id: "portfolio-website",
    title: "Website Portfolio",
    shortDescription: "Website cá nhân xây dựng bằng Next.JS và Tailwind CSS",
    description: "Một website portfolio hoàn chỉnh để trưng bày các dự án và kỹ năng lập trình.",
    technologies: ["Next.JS", "Tailwind CSS", "TypeScript", "React"],
    date: "2025-01-25",
    details: `Dự án này là một website portfolio được xây dựng bằng Next.JS 16 với App Router mới nhất.

Các tính năng chính:
- File-based routing tự động
- Nested layouts cho các phần khác nhau
- Dynamic routes cho blog posts
- Server-side rendering tối ưu
- Tailwind CSS để styling nhanh chóng
- TypeScript cho type safety

Quá trình phát triển:
1. Setup project với Create Next App
2. Tạo cấu trúc thư mục theo App Router
3. Xây dựng components: Navbar, Footer
4. Tạo các trang cục bộ
5. Implement dynamic routes cho blog
6. Tối ưu hóa performance

Bài học rút ra:
- App Router là paradigm shift từ Pages Router
- File-based routing giảm complexity
- Server Components giúp giảm bundle size
- TypeScript giúp catch bugs sớm hơn`,
  },
  {
    id: "todo-app",
    title: "Ứng dụng Quản lý Công việc (Todo App)",
    shortDescription: "Ứng dụng Todo App với React và Local Storage",
    description: "Một ứng dụng quản lý công việc đơn giản nhưng có đầy đủ tính năng.",
    technologies: ["React", "CSS Modules", "JavaScript", "Local Storage"],
    date: "2024-12-15",
    details: `Todo App là một bài tập thực hành React cơ bản nhưng đầy đủ tính năng.

Các tính năng:
- Thêm, xóa, chỉnh sửa công việc
- Đánh dấu hoàn thành
- Lọc công việc (All, Active, Completed)
- Lưu dữ liệu vào Local Storage
- Responsive design cho mobile

Công nghệ sử dụng:
- React hooks (useState, useEffect)
- CSS Modules cho styling
- Local Storage API để lưu trữ

Bài học:
- Quản lý state với React hooks
- Lifecycle methods trong functional components
- LocalStorage API
- Component composition`,
  },
  {
    id: "rest-api",
    title: "API RESTful — Quản lý Sản phẩm",
    shortDescription: "API quản lý sản phẩm với Node.js và Express",
    description: "Một backend API hoàn chỉnh với CRUD operations, authentication, và database.",
    technologies: ["Node.js", "Express", "MongoDB", "JWT"],
    date: "2024-11-20",
    details: `Đây là một REST API backend được xây dựng bằng Express.js

Các endpoints:
- GET /api/products - lấy danh sách sản phẩm
- GET /api/products/:id - lấy chi tiết sản phẩm
- POST /api/products - tạo sản phẩm mới
- PUT /api/products/:id - cập nhật sản phẩm
- DELETE /api/products/:id - xóa sản phẩm

Tính năng:
- Authentication với JWT
- Validation input
- Error handling
- Database integration với MongoDB
- Environment variables

Bài học:
- RESTful API design principles
- HTTP methods (GET, POST, PUT, DELETE)
- Middleware pattern
- Authentication & Authorization`,
  },
  {
    id: "chat-app",
    title: "Chat Application Real-time",
    shortDescription: "Ứng dụng chat với WebSocket và Firebase",
    description: "Một ứng dụng chat thời gian thực cho phép người dùng giao tiếp tức thì.",
    technologies: ["React", "WebSocket", "Firebase", "Tailwind CSS"],
    date: "2025-01-10",
    details: `Chat Application là một dự án full-stack sử dụng WebSocket cho real-time messaging.

Tính năng:
- Chat real-time giữa nhiều người dùng
- User authentication
- Message persistence
- Notification system
- User status (online/offline)
- Message search

Stack:
- Frontend: React + Tailwind CSS
- Backend: Node.js + WebSocket
- Database: Firebase Realtime Database

Kinh nghiệm:
- WebSocket vs HTTP polling
- Event-driven architecture
- Real-time data synchronization
- Scalability challenges`,
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}
