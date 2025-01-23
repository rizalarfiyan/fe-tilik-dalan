import { calcAspectRatio, cn, storageUrl } from '@/lib/utils'
import Hls, { type HlsConfig } from 'hls.js'
import { CirclePlay, CircleStop } from 'lucide-react'
import * as React from 'react'
import StateObject, { type IState } from './state-object'
import { Button } from './ui/button'

interface PlayerWrapperProps extends BasePlayerProps {
	width?: number
	height?: number
	thumbnail: string
	onChangePlaying?: (isPlaying: boolean) => void
}

const PlayerWrapper: React.FC<PlayerWrapperProps> = ({
	width,
	height,
	thumbnail,
	onChangePlaying,
	...props
}) => {
	const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
	const hasRender = React.useRef<boolean>(true)

	React.useEffect(() => {
		if (props.src) {
			setIsPlaying(false)
			hasRender.current = true
		}
	}, [props.src])

	const playFirstTime = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (hasRender.current) hasRender.current = false
		changeIsPlaying(true)
	}

	const changeIsPlaying = (isPlaying: boolean) => {
		setIsPlaying(isPlaying)
		onChangePlaying?.(isPlaying)
	}

	return (
		<div
			style={{
				aspectRatio: calcAspectRatio(width, height),
				backgroundSize: 'contain',
				backgroundImage: `url(${storageUrl(thumbnail)})`,
			}}
			className='relative flex items-center justify-center overflow-hidden rounded-md before:absolute before:inset-0 before:bg-slate-700/80 before:backdrop-blur-[5px] before:content-[""]'
		>
			{!hasRender.current ? (
				<Player
					isPlaying={isPlaying}
					changeIsPlaying={changeIsPlaying}
					{...props}
				/>
			) : (
				<ButtonPlayStop
					isPlaying={isPlaying}
					togglePlaying={playFirstTime}
					show
				/>
			)}
		</div>
	)
}

interface BasePlayerProps
	extends Omit<
		React.VideoHTMLAttributes<HTMLVideoElement>,
		'autoPlay' | 'className' | 'width' | 'height' | 'src'
	> {
	hlsConfig?: Partial<HlsConfig>
	playerRef: React.RefObject<HTMLVideoElement | null>
	overlay?: React.ReactNode
	src: string
}

interface PlayerProps extends BasePlayerProps {
	isPlaying: boolean
	changeIsPlaying: (isPlaying: boolean) => void
}

const Player: React.FC<PlayerProps> = ({
	playerRef,
	hlsConfig,
	isPlaying,
	changeIsPlaying,
	src,
	overlay,
	...props
}) => {
	const [state, setState] = React.useState<IState | null>(null)

	// biome-ignore lint/correctness/useExhaustiveDependencies: Skip hlsConfig from dependencies
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
							setState(null)
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

		setState({ loading: true })
		_initPlayer()

		return () => {
			if (hls != null) {
				hls.destroy()
			}
		}
	}, [playerRef, src])

	const togglePlaying = React.useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			if (!playerRef.current) return
			changeIsPlaying?.(!isPlaying)
			if (isPlaying) {
				playerRef.current.pause()
			} else {
				playerRef.current.play()
			}
		},
		[isPlaying, playerRef, changeIsPlaying],
	)

	const [show, setShow] = React.useState(false)
	const hasState = state?.loading || state?.error

	return (
		<div
			onMouseEnter={(e: React.MouseEvent) => {
				e.preventDefault()
				if (!isPlaying) return
				setShow(true)
			}}
			onMouseLeave={(e: React.MouseEvent) => {
				e.preventDefault()
				if (!isPlaying) return
				setShow(false)
			}}
			className="z-10"
		>
			{!state?.error && !state?.loading ? (
				<ButtonPlayStop
					show={show}
					isPlaying={isPlaying}
					togglePlaying={togglePlaying}
					overlay
				/>
			) : (
				<StateObject loadingText="Loading stream..." state={state} />
			)}
			<video className={cn(hasState && 'hidden')} ref={playerRef} {...props} />
			{overlay}
		</div>
	)
}

interface ButtonPlayStopProps {
	show?: boolean
	overlay?: boolean
	isPlaying: boolean
	togglePlaying: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const ButtonPlayStop: React.FC<ButtonPlayStopProps> = ({
	overlay,
	show,
	isPlaying,
	togglePlaying,
}) => {
	return (
		<div
			className={cn(
				'absolute inset-0 z-[1] flex h-full w-full items-center justify-center opacity-0 transition-all duration-500',
				(show || !isPlaying) && 'opacity-100',
				overlay && 'bg-slate-800/80',
			)}
		>
			<Button
				variant="outline"
				type="button"
				size="icon"
				className="p-6 text-primary hover:bg-slate-200"
				onClick={togglePlaying}
			>
				{isPlaying ? (
					<CircleStop className="size-8" />
				) : (
					<CirclePlay className="size-8" />
				)}
			</Button>
		</div>
	)
}

export default PlayerWrapper
export { Player }
