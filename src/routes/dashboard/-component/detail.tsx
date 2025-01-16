import HlsPlayer from '@components/hls-player'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import useDashboard from '@hooks/use-dashboard'
import { CirclePlay, X } from 'lucide-react'
import * as React from 'react'

function Detail() {
	const { active, setActive } = useDashboard()
	const [isPlaying, setIsPlaying] = React.useState(false)

	// TODO: fix bugs for update the state isPlaying on active change
	if (!active) return null

	const { title, image, link } = active
	const onDeactivate = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setActive(null)
	}

	const onPlay = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setIsPlaying(true)
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
				<div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md bg-slate-200">
					{isPlaying ? (
						<HlsPlayer className="h-full w-full" src={link} autoPlay controls />
					) : (
						<>
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
						</>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

export default Detail
