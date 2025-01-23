import DotLive from '@components/dot-live'
import Player from '@components/player'
import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import useDashboard from '@hooks/use-dashboard'
import { calcAspectRatio } from '@lib/utils'
import { Link } from '@tanstack/react-router'
import { ScanQrCode, X } from 'lucide-react'
import * as React from 'react'

function Detail() {
	const { active, setActive } = useDashboard()
	const playerRef = React.useRef<HTMLVideoElement | null>(null)
	if (!active) return null

	const { title, thumbnail, link, width, height } = active
	const onDeactivate = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setActive(null)
	}

	const tables = [
		{
			id: 1,
			label: 'Status',
			value: (
				<Badge variant="outline" className="">
					<DotLive color="red" className="mr-2" />
					Live
				</Badge>
			),
		},
		{
			id: 2,
			label: 'Resolution',
			value: `${width}x${height}`,
		},
		{
			id: 3,
			label: 'Aspect Ratio',
			value: calcAspectRatio(width, height, ':'),
		},
	]

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
					<X className="size-5" />
				</Button>
			</div>
			<CardContent className="space-y-3">
				<Player
					playerRef={playerRef}
					src={link}
					thumbnail={thumbnail}
					width={width}
					height={height}
					muted
				/>
				<div className="flex items-center">
					<table className="w-full">
						<tbody>
							{tables.map(({ id, label, value }) => (
								<tr key={id}>
									<td className="w-32 py-0.5 font-semibold">{label}</td>
									<td className="py-1">: {value}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="flex w-full items-center justify-center">
						<Button asChild>
							<Link to="/dashboard/detection">
								<ScanQrCode className="mr-1 size-5" />
								<span>Detect Now</span>
							</Link>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default Detail
