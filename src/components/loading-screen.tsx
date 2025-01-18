import { cn } from '@/lib/utils'
import type React from 'react'
import Typography from '@components/typography'
import { Loader2, type LucideIcon } from 'lucide-react'

export interface LoadingScreenProps
	extends React.HTMLAttributes<HTMLDivElement> {
	reason?: string
	icon?: LucideIcon
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
	reason,
	className,
	icon: Icon,
	...rest
}) => {
	return (
		<div
			className={cn(
				'fixed inset-0 z-50 mx-auto flex h-full min-h-screen w-full items-center justify-center bg-background',
				className,
			)}
			{...rest}
		>
			<div className="flex flex-col items-center">
				{Icon ? (
					<div className="flex flex-col items-center gap-4 text-primary">
						<Icon className="size-12" />
						<div className="relative h-2 w-36 overflow-hidden rounded-full bg-slate-200">
							<div className="absolute top-0 left-0 h-full w-1/2 animate-move bg-current" />
						</div>
					</div>
				) : (
					<Loader2 className="size-14 animate-spin text-primary" />
				)}
				{reason && (
					<Typography
						variant="large"
						className="mt-3 max-w-[220px] text-center text-slate-600 dark:text-slate-200"
					>
						{reason}
					</Typography>
				)}
			</div>
		</div>
	)
}

export default LoadingScreen
