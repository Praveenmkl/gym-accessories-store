import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-none text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-neutral-800 shadow-none border border-black",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-none border border-red-600",
        outline: "border border-black bg-white text-black hover:bg-neutral-100 shadow-none",
        secondary: "bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-200",
        ghost: "hover:bg-neutral-100 text-black hover:text-black",
        link: "text-black underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
