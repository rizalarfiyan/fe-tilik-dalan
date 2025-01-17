import Logo from '@components/logo'
import Typography from '@components/typography'
import { Button } from '@components/ui/button'
import { Progress } from '@components/ui/progress'
import { cn } from '@lib/utils'
import { Loader2, RefreshCw, TriangleAlert } from 'lucide-react'
import * as React from 'react'

interface WrapperProps extends React.PropsWithChildren {
	isLoading?: boolean
}

const Wrapper: React.FC<WrapperProps> = ({ children, isLoading }) => {
	return (
		<div className="flex aspect-video w-full items-center justify-center rounded-lg border p-8">
			<div
				className={cn(
					'w-full max-w-[250px] text-center',
					isLoading ? 'animate-pulse space-y-4' : 'space-y-2',
				)}
			>
				{children}
			</div>
		</div>
	)
}

interface IProgress {
	percentage: number
	reason: string
}

function LoadModel() {
	const [error, setError] = React.useState<string | null>(null)
	const [progress, setProgress] = React.useState<IProgress | null>(null)

	React.useEffect(() => {
		setError('Something went wrong! Please try again later.')
		setProgress(null)
		// setError(null)
		// setProgress({ percentage: 50, reason: 'Downloading model' })
	}, [])

	if (progress) {
		return (
			<Wrapper isLoading>
				<Loader2 className="mx-auto size-12 animate-spin text-red-500" />
				<Logo />
				{progress !== null && (
					<div className="flex items-center justify-center gap-3">
						<Progress
							value={progress.percentage}
							className="mx-auto h-3 w-full"
						/>
						<Typography as="span" variant="small" className="text-primary">
							{progress.percentage}%
						</Typography>
					</div>
				)}
				<Typography variant="muted">
					{progress?.reason || 'Loading model...'}
				</Typography>
			</Wrapper>
		)
	}

	if (error) {
		return (
			<Wrapper>
				<TriangleAlert className="mx-auto size-16 text-red-500" />
				<Logo />
				<Typography variant="muted">{error}</Typography>
				<div>
					<Button className="mt-4 font-semibold" disabled={progress !== null}>
						Reload model
						<RefreshCw className="size-4" />
					</Button>
				</div>
			</Wrapper>
		)
	}

	return 'DONE'
}

export default LoadModel
