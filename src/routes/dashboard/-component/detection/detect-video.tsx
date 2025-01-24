import type { CCTV } from '@/types/cctv'
import PlayerWrapper from '@components/player'
import Typography from '@components/typography'
import { TRACKING_THRESHOLD } from '@constants'
import useDetection from '@hooks/use-detection'
import { isMobile as detectIsMobile } from '@lib/utils'
import { CircleAlert } from 'lucide-react'
import * as React from 'react'

interface DetectVideoProps {
	cctv: CCTV
}

interface ITrackedObject {
	centerX: number
	centerY: number
	label: string
}

const isMobile = detectIsMobile()

const DetectVideo: React.FC<DetectVideoProps> = ({ cctv }) => {
	const { model } = useDetection()
	const shape = model!.shape()

	const { link, thumbnail, width, height } = cctv!
	const playerRef = React.useRef<HTMLVideoElement>(null)
	const canvasRef = React.useRef<HTMLCanvasElement>(null)
	const stateRef = React.useRef<boolean>(false)
	const [isPlaying, setIsPlaying] = React.useState<boolean>(false)

	const trackedObjectsRef = React.useRef<Record<string, ITrackedObject>>({})
	const currentObjectsRef = React.useRef<Record<string, ITrackedObject>>({})

	React.useEffect(() => {
		if (!link) return
		stateRef.current = false
	}, [link])

	React.useEffect(() => {
		if (isMobile) return

		// first render
		if (!isPlaying && !playerRef.current) return

		if (!isPlaying) {
			stateRef.current = false
			return
		}

		if (!playerRef.current) return
		stateRef.current = true
		playerRef.current.onplaying = handleOnPlaying
	}, [isPlaying])

	const handleOnPlaying = React.useCallback(async () => {
		const canvas = canvasRef?.current
		const player = playerRef?.current
		if (!player || !canvas || !model) return

		const ctx = canvas.getContext('2d')!
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		model.detectVideo(player, canvas, stateRef, {
			centerBox: true,
			label: true,
			prediction: 'percent',
			fill: true,
			beforeMount: () => {
				currentObjectsRef.current = {}
			},
			afterMount: () => {
				trackedObjectsRef.current = currentObjectsRef.current
			},
			skipCallback({ centerX, centerY, label, iteration }) {
				let matchedId: string | null = null
				for (const id in trackedObjectsRef.current) {
					const trackedObj = trackedObjectsRef.current[id]
					const valX = (centerX - trackedObj.centerX) ** 2
					const valY = (centerY - trackedObj.centerY) ** 2
					const distance = Math.sqrt(valX + valY)
					if (distance < TRACKING_THRESHOLD && label === trackedObj.label) {
						matchedId = id
						break
					}
				}

				if (matchedId) {
					const trackedObj = trackedObjectsRef.current[matchedId]

					trackedObj.centerX = centerX
					trackedObj.centerY = centerY
					currentObjectsRef.current[matchedId] = trackedObj
				} else {
					const newId = `${label}_${Date.now()}_${iteration}`
					currentObjectsRef.current[newId] = {
						centerX,
						centerY,
						label,
					}

					return {
						isValid: true,
						type: 'count',
					}
				}

				return {
					isValid: false,
				}
			},
			dataCallback(data) {
				console.log('Detection: ', data)
			},
		})
	}, [model])

	return (
		<div className="flex items-center justify-center gap-4">
			<div className="relative w-full max-w-3xl">
				<PlayerWrapper
					playerRef={playerRef}
					src={link}
					thumbnail={thumbnail}
					width={width}
					height={height}
					onChangePlaying={setIsPlaying}
					overlay={
						<canvas
							ref={canvasRef}
							width={shape[1]}
							height={shape[2]}
							className="absolute inset-0 h-full w-full"
						/>
					}
					hlsConfig={{
						maxBufferLength: 60,
						maxMaxBufferLength: 120,
						maxBufferSize: 30 * 1000 * 1000,
					}}
					muted
				/>
			</div>
			<div className="flex-grow space-y-4">
				{isMobile ? (
					<div className="mx-auto flex max-w-sm items-center gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-red-600">
						<CircleAlert className="size-8 flex-shrink-0" />
						<Typography as="span" variant="muted" className="text-red-600">
							This feature is not available on mobile
						</Typography>
					</div>
				) : (
					<div className="mx-auto flex max-w-sm items-center gap-3 rounded-md border border-orange-200 bg-orange-50 p-3 text-orange-600">
						<CircleAlert className="size-8 flex-shrink-0" />
						<Typography as="span" variant="muted" className="text-orange-600">
							The result may not be accurate, because FPS is limited by the
							browser. Realtime detection with GPU is experimental on browser.
						</Typography>
					</div>
				)}
			</div>
		</div>
	)
}

export default DetectVideo
