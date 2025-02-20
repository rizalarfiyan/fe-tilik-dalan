import * as React from 'react'
import { cn } from '@lib/utils'
import type { LucideProps } from 'lucide-react'

type IconProps =
	| React.SVGProps<SVGSVGElement>
	| LucideProps
	| (React.SVGProps<SVGSVGElement> & { children?: never })

type IconPropsWithBehavior<T extends IconProps> = T & {
	behavior: 'append' | 'prepend'
}
type IconComponent<T extends IconProps = IconProps> = React.ComponentType<T>

type InputProps<T extends IconComponent = IconComponent> =
	React.InputHTMLAttributes<HTMLInputElement> & {
		icon?: T
		iconProps: T extends IconComponent<infer P>
			? IconPropsWithBehavior<P>
			: never
	}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			type,
			icon: Icon,
			iconProps: {
				behavior: iconBehavior,
				className: iconClassName,
				...iconProps
			},
			...props
		},
		ref,
	) => {
		return (
			<div
				className={cn(
					'm-0 flex items-center justify-center rounded-md border border-input bg-transparent p-0 px-3 py-0 text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
					className,
				)}
			>
				{Icon && type !== 'file' && iconBehavior === 'prepend' && (
					<Icon
						className={cn('mr-3 h-4 w-4 text-muted-foreground', iconClassName)}
						{...iconProps}
					/>
				)}
				<input
					type={type}
					className={cn(
						'flex h-9 w-full items-center justify-center bg-transparent file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
						type !== 'file' ? 'py-1' : 'py-1.5',
						className,
					)}
					ref={ref}
					{...props}
				/>
				{Icon && type !== 'file' && iconBehavior === 'append' && (
					<Icon
						className={cn('ml-3 h-4 w-4 text-muted-foreground', iconClassName)}
						{...iconProps}
					/>
				)}
			</div>
		)
	},
)

Input.displayName = 'Input'

export { Input }
