"use client";

import { useActionState } from "react";
import { createGuestbookEntry, ActionState } from "@/app/guestbook/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ActionState = {
  success: false,
};

export default function GuestbookForm() {
  const [state, formAction, isPending] = useActionState(
    createGuestbookEntry,
    initialState
  );

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Viết lời nhắn</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên của bạn</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nhập tên của bạn"
              required
            />
            {state.errors?.name && (
              <p className="text-red-500 text-sm">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Lời nhắn</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Viết lời nhắn của bạn..."
              required
              rows={3}
            />
            {state.errors?.message && (
              <p className="text-red-500 text-sm">
                {state.errors.message[0]}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Đang gửi..." : "Gửi lời nhắn"}
          </Button>

          {state.success && (
            <p className="text-green-600 text-sm">
              Gửi lời nhắn thành công!
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
