import PlayerWrapper from '@components/player'
import { Button } from '@components/ui/button'
import { createLazyFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createLazyFileRoute('/test')({
	component: () => {
		return (
			<div className="flex h-full min-h-screen w-full items-center justify-center">
				<Page />
			</div>
		)
	},
})

const src = 'http://localhost:8082/jombor.m3u8'
const thumbnail =
	'http://localhost:8081/cctv/thumb/253efd50-60ee-4b20-b2c0-5fab5adaa32a.jpg'
const width = 1920
const height = 1080

let i = 0
function Page() {
	const [num, setNum] = React.useState<number>(0)
	const playerRef = React.useRef<HTMLVideoElement>(null)
	const [isPlaying, setIsPlaying] = React.useState<boolean>(false)

	React.useEffect(() => {
		if (!isPlaying && !playerRef.current) return
		// console.log(`Status Play: ${isPlaying ? 'Bermain' : 'Dihentikan'}`)
		// console.log(playerRef.current)
	}, [isPlaying])

	return (
		<div className="aspect-video w-full max-w-3xl space-y-2 border">
			<PlayerWrapper
				playerRef={playerRef}
				src={src}
				thumbnail={thumbnail}
				width={width}
				height={height}
				onChangePlaying={setIsPlaying}
				hlsConfig={{
					maxBufferLength: 60,
					maxMaxBufferLength: 120,
					maxBufferSize: 30 * 1000 * 1000,
				}}
				muted
			/>
			<Button type="button" onClick={() => setNum((num) => num + 1)}>
				++
			</Button>
			<div>
				<code>
					<pre>{JSON.stringify({ num, isPlaying, render: i++ }, null, 2)}</pre>
				</code>
			</div>
		</div>
	)
}
