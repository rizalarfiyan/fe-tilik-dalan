import Logo from '@components/logo'
import Typography from '@components/typography'
import { Button } from '@components/ui/button'
import { Progress } from '@components/ui/progress'
import { MODEL_CLASSES, STORAGE_BASE_URL } from '@constants'
import useDashboard from '@hooks/use-dashboard'
import useDetection from '@hooks/use-detection'
import { calcAspectRatio, cn } from '@lib/utils'
import Yolo from '@lib/yolo'
import { Loader2, RefreshCw, TriangleAlert } from 'lucide-react'
import * as React from 'react'

interface WrapperProps extends React.PropsWithChildren {
	isLoading?: boolean
}

const Wrapper: React.FC<WrapperProps> = ({ children, isLoading }) => {
	const { active } = useDashboard()

	return (
		<div
			style={{
				aspectRatio: calcAspectRatio(active?.width, active?.height),
			}}
			className="flex w-full items-center justify-center rounded-lg border p-8"
		>
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

const MODEL_URL = `${STORAGE_BASE_URL}model/yolov8n/model.json`

const LoadModel: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { setIsDisable } = useDashboard()
	const { model, setModel } = useDetection()
	const modelRef = React.useRef<Yolo | null>(null)
	const [error, setError] = React.useState<string | null>(null)
	const [progress, setProgress] = React.useState<IProgress | null>(null)

	React.useEffect(() => {
		if (modelRef.current) return

		const loadModel = async () => {
			try {
				setIsDisable(true)
				modelRef.current = await Yolo.loadModel({
					modelPath: MODEL_URL,
					classes: MODEL_CLASSES,
					onProgress: setProgress,
				})

				setModel(modelRef.current)
			} catch {
				setError('Failed to load model. Please try again later.')
			} finally {
				setProgress(null)
				setIsDisable(false)
			}
		}

		loadModel()
		return () => {
			console.info('Disposing model...')
			modelRef.current?.dispose()
			modelRef.current = null
			setModel(null)
		}
	}, [setModel, setIsDisable])

	const handleReloadModel = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (!modelRef.current) return

		try {
			await modelRef.current.removeModel()
			const newModel = await modelRef.current.reloadModel()
			modelRef.current = newModel
			setModel(newModel)
		} catch (error) {
			console.error('Error loading model:', error)
			setError('Failed to reload model. Please try again later.')
		}
	}

	if (progress || !model) {
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
					<Button
						className="mt-4 font-semibold"
						disabled={progress !== null}
						onClick={handleReloadModel}
					>
						Reload model
						<RefreshCw className="size-4" />
					</Button>
				</div>
			</Wrapper>
		)
	}

	return children
}

export default LoadModel
