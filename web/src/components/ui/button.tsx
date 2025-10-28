import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#89CFF0]",
  {
    variants: {
      variant: {
        // Fundo preto, texto azul BB
        default:
          "bg-black text-[#89CFF0] hover:bg-gray-900 border border-[#89CFF0]",

        // Fundo azul BB, texto preto (estilo destrutivo invertido)
        destructive:
          "bg-[#89CFF0] text-black border border-black hover:bg-[#78bde0]",

        // Borda preta, fundo azul BB
        outline:
          "border border-black bg-[#89CFF0] text-black hover:bg-[#78bde0]",

        // Fundo azul BB escuro (secundário)
        secondary:
          "bg-[#78bde0] text-black hover:bg-[#66acd0] border border-black",

        // Botão fantasma (sem fundo, só hover azul)
        ghost:
          "bg-transparent text-black hover:bg-[#89CFF0]/30",

        // Link simples (azul BB e preto)
        link:
          "text-black underline-offset-4 hover:underline hover:text-[#004c70]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
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
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
