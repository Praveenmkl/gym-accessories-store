import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "cn"

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, id, ...props }, ref) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      id={id}
      ref={ref}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-md border border-slate-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all flex items-center justify-center",
        checked ? "bg-slate-900 border-slate-900 text-white" : "bg-white hover:border-slate-400",
        className
      )}
      {...props}
    >
      {checked && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
    </button>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
