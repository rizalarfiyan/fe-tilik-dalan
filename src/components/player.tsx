import * as React from 'react'
import Hls, { type HlsConfig } from 'hls.js'
import {
	AlertCircle,
	CirclePlay,
	CircleStop,
	Loader2,
	type LucideIcon,
} from 'lucide-react'
import { aspectRatio, cn } from '@/lib/utils'
import Typography from './typography'
import { Button } from './ui/button'

interface IStatus {
	loading?: boolean
	error?: string | null
}

export interface HlsPlayerProps
	extends Omit<
		React.VideoHTMLAttributes<HTMLVideoElement>,
		'autoPlay' | 'className'
	> {
	hlsConfig?: Partial<HlsConfig>
	playerRef: React.RefObject<HTMLVideoElement | null>
	aspect?: string
	thumbnail: string
	src: string
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({
	hlsConfig,
	playerRef,
	src,
	...props
}) => {
	const [status, setStatus] = React.useState<IStatus | null>(null)
	const [isPlaying, setIsPlaying] = React.useState<boolean>(true)

	React.useEffect(() => {
		let hls: Hls

		function _initPlayer() {
			if (hls != null) {
				hls.destroy()
			}

			const newHls = new Hls({
				enableWorker: false,
				...hlsConfig,
			})

			if (playerRef.current != null) {
				newHls.attachMedia(playerRef.current)
			}

			newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
				newHls.loadSource(src)
				newHls.on(Hls.Events.MANIFEST_PARSED, () => {
					playerRef?.current
						?.play()
						.then(() => {
							setStatus(null)
						})
						.catch(() => {
							console.warn(
								'Unable to autoplay prior to user interaction with the dom.',
							)
						})
				})
			})

			newHls.on(Hls.Events.ERROR, (_, data) => {
				if (data.fatal) {
					switch (data.type) {
						case Hls.ErrorTypes.NETWORK_ERROR:
							newHls.startLoad()
							break
						case Hls.ErrorTypes.MEDIA_ERROR:
							newHls.recoverMediaError()
							break
						default:
							_initPlayer()
							break
					}
				}
			})

			hls = newHls
		}

		setStatus({ loading: true })
		_initPlayer()

		return () => {
			if (hls != null) {
				hls.destroy()
			}
		}
	}, [hlsConfig, playerRef, src])

	const togglePlaying = React.useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			if (!playerRef.current) return
			setIsPlaying((prev) => !prev)
			if (isPlaying) {
				playerRef.current.pause()
			} else {
				playerRef.current.play()
			}
		},
		[isPlaying, playerRef],
	)

	const [show, setShow] = React.useState(false)
	const hasState = status?.loading || status?.error

	return (
		<div
			onMouseEnter={(e: React.MouseEvent) => {
				e.preventDefault()
				setShow(true)
			}}
			onMouseLeave={(e: React.MouseEvent) => {
				e.preventDefault()
				setShow(false)
			}}
			className="z-10"
		>
			{!status?.error && !status?.loading ? (
				<ButtonPlayStop
					show={show}
					isPlaying={isPlaying}
					onClick={togglePlaying}
					overlay
				/>
			) : (
				<>
					<div className="absolute inset-0 z-[-1] h-full w-full bg-slate-700/50" />
					{status?.loading && (
						<State
							icon={Loader2}
							iconClassName="animate-spin"
							message="Loading Stream"
						/>
					)}
					{status?.error && <State icon={AlertCircle} message={status.error} />}
				</>
			)}
			<video className={cn(hasState && 'hidden')} ref={playerRef} {...props} />
		</div>
	)
}

interface StateProps {
	icon: LucideIcon
	iconClassName?: string
	message: string
}

const State: React.FC<StateProps> = ({
	icon: Icon,
	iconClassName,
	message,
}) => {
	return (
		<div className="z-10 flex items-center justify-center gap-3 rounded-md bg-slate-800 p-3">
			<Icon className={cn('size-5 text-white', iconClassName)} />
			<Typography className="!mt-0 font-medium text-sm text-white">
				{message}
			</Typography>
		</div>
	)
}

interface ButtonPlayStopProps {
	show?: boolean
	overlay?: boolean
	isPlaying: boolean
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const ButtonPlayStop: React.FC<ButtonPlayStopProps> = ({
	overlay,
	show,
	isPlaying,
	onClick,
}) => {
	return (
		<>
			{overlay && (
				<div
					className={cn(
						'absolute inset-0 h-full w-full bg-slate-700/50 opacity-0 transition-all duration-300',
						show && 'opacity-100',
					)}
				/>
			)}
			<Button
				variant="outline"
				type="button"
				size="icon"
				className={cn(
					'-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10 p-6 text-primary opacity-0 transition-all duration-500 hover:bg-slate-200',
					show && 'opacity-100',
				)}
				onClick={onClick}
			>
				{isPlaying ? (
					<CircleStop className="size-8" />
				) : (
					<CirclePlay className="size-8" />
				)}
			</Button>
		</>
	)
}

const HlsPlayerWrapper: React.FC<HlsPlayerProps> = (props) => {
	const { src, aspect, thumbnail } = props
	const [isPlaying, setIsPlaying] = React.useState<boolean>(false)

	const ratio = React.useMemo(() => {
		const val = aspectRatio(aspect)
		return `${val[0]} / ${val[1]}`
	}, [aspect])

	React.useEffect(() => {
		if (src) setIsPlaying(false)
	}, [src])

	const onPlaying = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setIsPlaying((prev) => !prev)
	}

	return (
		<div
			style={{
				aspectRatio: ratio,
				backgroundSize: 'contain',
				backgroundImage: `url(${thumbnail})`,
			}}
			className='relative flex items-center justify-center overflow-hidden rounded-md before:absolute before:inset-0 before:bg-slate-700/80 before:backdrop-blur-[3px] before:content-[""]'
		>
			{isPlaying ? (
				<HlsPlayer {...props} />
			) : (
				<ButtonPlayStop isPlaying={isPlaying} onClick={onPlaying} show />
			)}
		</div>
	)
}

export default React.memo(HlsPlayerWrapper)
