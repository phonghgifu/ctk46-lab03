import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-950 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
      className
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = "Textarea"

export { Textarea }
