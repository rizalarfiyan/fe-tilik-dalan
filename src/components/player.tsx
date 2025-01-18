import { calcAspectRatio, cn } from '@/lib/utils'
import Hls, { type HlsConfig } from 'hls.js'
import { CirclePlay, CircleStop } from 'lucide-react'
import * as React from 'react'
import StateObject, { type IState } from './state-object'
import { Button } from './ui/button'

export interface HlsPlayerProps
	extends Omit<
		React.VideoHTMLAttributes<HTMLVideoElement>,
		'autoPlay' | 'className'
	> {
	hlsConfig?: Partial<HlsConfig>
	playerRef: React.RefObject<HTMLVideoElement | null>
	width?: number
	height?: number
	thumbnail: string
	src: string
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({
	hlsConfig,
	playerRef,
	src,
	...props
}) => {
	const [state, setState] = React.useState<IState | null>(null)
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
	const hasState = state?.loading || state?.error

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
			{!state?.error && !state?.loading ? (
				<ButtonPlayStop
					show={show}
					isPlaying={isPlaying}
					onClick={togglePlaying}
					overlay
				/>
			) : (
				<StateObject loadingText="Loading stream..." state={state} />
			)}
			<video className={cn(hasState && 'hidden')} ref={playerRef} {...props} />
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
				onClick={onClick}
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

const HlsPlayerWrapper: React.FC<HlsPlayerProps> = (props) => {
	const { src, width, height, thumbnail } = props
	const [isPlaying, setIsPlaying] = React.useState<boolean>(false)

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
				aspectRatio: calcAspectRatio(width, height),
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
