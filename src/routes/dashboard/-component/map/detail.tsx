import HlsPlayerWithControls from '@components/player'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import useDashboard from '@hooks/use-dashboard'
import { X } from 'lucide-react'
import * as React from 'react'

function Detail() {
	const { active, setActive } = useDashboard()
	const playerRef = React.useRef<HTMLVideoElement | null>(null)
	if (!active) return null

	const { title, image, link, aspect } = active
	const onDeactivate = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setActive(null)
	}

	return (
		<Card className="absolute top-4 left-4 z-10 w-full max-w-xl">
			<div className="flex flex-row justify-between gap-4">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<Button
					variant="outline"
					type="button"
					size="icon"
					className="m-4 flex-shrink-0"
					onClick={onDeactivate}
				>
					<X />
				</Button>
			</div>
			<CardContent>
				<HlsPlayerWithControls
					playerRef={playerRef}
					src={link}
					thumbnail={image.thumb}
					aspect={aspect}
					muted
				/>
				{/* {isPlaying ? (
					<div className='relative flex w-full items-center justify-center overflow-hidden rounded-md bg-slate-200'>
						<HlsPlayerWithControls
							playerRef={playerRef}
							src={link}
							autoPlay
							muted
						/>
					</div>
				) : (
					<div className="relative flex w-full items-center justify-center overflow-hidden rounded-md bg-slate-200">
						<img src={image.src} alt={title} className="object-cover" />
						<div className="absolute inset-0 h-full w-full bg-slate-700/80" />
						<Button
							variant="outline"
							type="button"
							size="icon"
							className="absolute p-6 text-primary"
							onClick={onPlay}
						>
							<CirclePlay className="!size-8" />
						</Button>
					</div>
				)} */}
			</CardContent>
		</Card>
	)
}

export default Detail
