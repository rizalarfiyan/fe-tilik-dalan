import { cn } from '@/lib/utils'
import type React from 'react'
import Typography from '@components/typography'
import { Loader2 } from 'lucide-react'

export interface LoadingScreenProps
	extends React.HTMLAttributes<HTMLDivElement> {
	reason?: string
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
	reason,
	className,
	...rest
}) => {
	return (
		<div
			className={cn(
				'fixed inset-0 mx-auto flex h-full min-h-screen w-full items-center justify-center bg-background',
				className,
			)}
			{...rest}
		>
			<div className="flex flex-col items-center">
				<Loader2 className="size-14 animate-spin text-primary" />
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
