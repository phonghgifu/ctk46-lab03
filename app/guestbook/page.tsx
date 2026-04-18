import { guestbookEntries } from "@/data/guestbook";
import GuestbookForm from "@/components/guestbook-form";
import DeleteButton from "@/components/delete-button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function GuestbookPage() {
  const entries = guestbookEntries;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Sổ lưu bút</h1>
      <p className="text-gray-500 mb-8">Hãy để lại lời nhắn cho tôi nhé!</p>

      <GuestbookForm />

      <Separator className="my-8" />

      <div className="space-y-4">
        <p className="text-sm text-gray-400">{entries.length} lời nhắn</p>

        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">
                  {entry.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(entry.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <DeleteButton id={entry.id} />
                </div>
              </div>
              <p className="text-gray-600">{entry.message}</p>
            </CardContent>
          </Card>
        ))}

        {entries.length === 0 && (
          <p className="text-center text-gray-400 py-8">
            Chưa có lời nhắn nào. Hãy là người đầu tiên!
          </p>
        )}
      </div>
    </div>
  );
}
