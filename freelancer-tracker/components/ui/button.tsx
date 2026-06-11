import { cva, type VariantProps } from 'class-variance-authority'
import { type ButtonHTMLAttributes } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-700',
        secondary: 'bg-white border border-brand-200 text-brand-900 hover:bg-brand-50',
        outline: 'border border-brand-300 text-brand-700 bg-transparent hover:bg-brand-50',
        ghost: 'bg-transparent text-brand-700 hover:bg-brand-100',
      },
      size: {
        default: 'h-12 px-5 text-sm',
        sm: 'h-10 px-4 text-sm',
        lg: 'h-14 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} type={type} {...props} />
  )
}
