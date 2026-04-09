import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles: pill shape, smooth transitions, minimal & clean
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-full text-sm font-medium",
    "transition-all duration-150 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // Solid primary — bold CTA
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",

        // Danger action
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",

        // Outlined — secondary CTA
        outline:
          "border border-input bg-background text-foreground hover:bg-gray-50 hover:border-gray-300 hover:text-foreground",

        // Muted filled — less prominent than primary
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:text-gray-900",

        // Ghost — icon buttons or nav items
        ghost:
          "hover:bg-gray-100 hover:rounded-full text-gray-700 hover:text-gray-700",

        // Inline text link
        link:
          "text-primary underline-offset-4 hover:underline hover:text-primary",
      },
      size: {
        default: "h-12 px-6 py-2.5",
        sm: "h-9  px-4 py-1.5 text-xs",
        lg: "h-14 px-8 py-3 text-base",
        xl: "h-16 px-10 py-4 text-base font-semibold",
        icon: "h-12 w-12 p-0",
        "icon-sm": "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
