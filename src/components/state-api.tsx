import { Loader2, type LucideIcon, TriangleAlert } from 'lucide-react'
import type React from 'react'
import Typography from './typography'
import { cn } from '@lib/utils'

interface IndicatorProps {
	message: string
	icon: LucideIcon
	className?: string
	wrapClassName?: string
	iconClassName?: string
	textClassName?: string
}

export const Indicator: React.FC<IndicatorProps> = ({
	icon: Icon,
	message,
	className,
	wrapClassName,
	iconClassName,
	textClassName,
}) => {
	return (
		<div className={cn('flex h-32 items-center justify-center', className)}>
			<div
				className={cn(
					'flex flex-col items-center gap-3 text-center',
					wrapClassName,
				)}
			>
				<Icon className={cn('size-10 text-primary', iconClassName)} />
				<Typography variant="muted" className={textClassName}>
					{message}
				</Typography>
			</div>
		</div>
	)
}

interface StateApiProps extends React.PropsWithChildren {
	className?: string
	wrapClassName?: string
	isLoading?: boolean
	error?: string | null
}

const StateApi: React.FC<StateApiProps> = ({
	isLoading,
	error,
	children,
	...rest
}) => {
	if (isLoading) {
		return (
			<Indicator
				icon={Loader2}
				message="Loading..."
				iconClassName="animate-spin"
				{...rest}
			/>
		)
	}

	if (error) {
		return (
			<Indicator
				icon={TriangleAlert}
				message={error}
				textClassName="text-red-600"
				iconClassName="text-red-600"
				{...rest}
			/>
		)
	}

	return children
}

export default StateApi
