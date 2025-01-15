import type React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const typographyVariants = cva('text-slate-800', {
	variants: {
		variant: {
			h1: 'scroll-m-20 font-bold text-4xl tracking-tight lg:text-5xl',
			h2: 'scroll-m-20 font-semibold text-3xl tracking-tight transition-colors first:mt-0',
			h3: 'scroll-m-20 font-semibold text-2xl tracking-tight',
			h4: 'scroll-m-20 font-semibold text-xl tracking-tight',
			p: 'leading-7 [&:not(:first-child)]:mt-6',
			lead: 'text-muted-foreground text-xl',
			large: 'font-semibold text-lg',
			small: 'font-medium text-sm leading-none',
			muted: 'text-muted-foreground',
		},
	},
	defaultVariants: {
		variant: 'p',
	},
})

export interface TypographyProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof typographyVariants> {
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
}

const Typography: React.FC<TypographyProps> = ({
	as: Component = 'p',
	className,
	variant,
	...props
}) => {
	return (
		<Component
			className={cn(typographyVariants({ variant }), className)}
			{...props}
		/>
	)
}

export default Typography
