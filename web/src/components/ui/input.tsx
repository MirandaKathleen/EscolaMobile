import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
        
          "flex h-10 w-full rounded-md border border-black bg-[#89CFF0] px-3 py-2 text-base text-black placeholder:text-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-black md:text-sm dark:bg-black dark:text-[#89CFF0] dark:border-[#89CFF0] dark:placeholder:text-[#89CFF0]/70 dark:file:text-[#89CFF0]",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
