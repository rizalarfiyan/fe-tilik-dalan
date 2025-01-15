import type * as React from 'react'
import { cn } from '@lib/utils'
import { APP_NAME } from '@constants'
import Typography from './typography'

interface LogoProps {
	className?: string
	typographyClassName?: string
	svgClassName?: string
	dotContrast?: boolean
	logoOnly?: boolean
}

const Logo: React.FC<LogoProps> = ({
	logoOnly,
	className,
	svgClassName,
	typographyClassName,
	dotContrast,
}) => {
	return (
		<div
			className={cn(
				'flex items-center justify-center gap-2 text-primary',
				className,
			)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				className={cn('size-10', svgClassName)}
			>
				<path
					className="fill-current"
					d="M16.65 9.57h2.59c.4 0 .72.32.72.72v.39c0 5.13-4.2 9.33-9.33 9.33H4.71c-.4 0-.72-.32-.72-.72v-2.6c0-.4.32-.72.72-.72h5.93c2.92 0 5.29-2.37 5.29-5.29v-.39c0-.4.32-.72.72-.72"
				/>
				<path
					d="M13.61 3.99h-8.9c-.4 0-.72.32-.72.72v2.56c0 .4.32.72.72.72h.14c.4 0 .72.32.72.72v4.96c0 .4.32.72.72.72h2.56c.4 0 .72-.32.72-.72V8.71c0-.4.32-.72.72-.72h3.32c.4 0 .72-.32.72-.72V4.71c0-.4-.32-.72-.72-.72"
					className="fill-current"
				/>
				<path
					d="M15.91 4.71v2.56c0 .4.32.72.72.72h2.61c.4 0 .72-.32.72-.72V4.71c0-.4-.32-.72-.72-.72h-2.61c-.4 0-.72.31-.72.71Z"
					className={cn(
						dotContrast ? 'fill-primary-foreground' : 'fill-slate-800',
					)}
				/>
			</svg>
			{!logoOnly && (
				<Typography
					as="p"
					variant="h3"
					className={cn(
						'font-extrabold text-2xl text-slate-800 tracking-wide',
						typographyClassName,
					)}
				>
					{APP_NAME}
				</Typography>
			)}
		</div>
	)
}

export default Logo
