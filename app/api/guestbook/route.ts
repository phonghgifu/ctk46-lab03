import { NextRequest, NextResponse } from "next/server";
import { guestbookEntries } from "@/data/guestbook";

// GET /api/guestbook — Lấy danh sách tất cả lời nhắn
export async function GET() {
  return NextResponse.json(guestbookEntries);
}

// POST /api/guestbook — Thêm lời nhắn mới
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Kiểm tra dữ liệu đầu vào
  if (!body.name || !body.message) {
    return NextResponse.json(
      { error: "Tên và lời nhắn là bắt buộc" },
      { status: 400 }
    );
  }

  // Tạo entry mới
  const newEntry = {
    id: Date.now().toString(),
    name: body.name,
    message: body.message,
    createdAt: new Date().toISOString(),
  };

  // Thêm vào đầu mảng (hiển thị mới nhất trước)
  guestbookEntries.unshift(newEntry);

  return NextResponse.json(newEntry, { status: 201 });
}
