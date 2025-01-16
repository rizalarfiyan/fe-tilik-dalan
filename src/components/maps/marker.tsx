import type { CCTV } from '@/types/cctv'
import HlsPlayer from '@components/hls-player'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog'
import * as React from 'react'
import { Marker as MapMarker } from 'react-map-gl'
import MarkerIcon from './marker-icon'

const Marker: React.FC<CCTV> = ({ latitude, longitude, title, link }) => {
	const [isOpen, setIsOpen] = React.useState(false)

	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle className="text-center">{title}</DialogTitle>
					</DialogHeader>
					<HlsPlayer
						className="aspect-video h-full w-full overflow-hidden rounded-md"
						src={link}
						autoPlay
						controls
					/>
				</DialogContent>
			</Dialog>
			<MapMarker
				longitude={longitude}
				latitude={latitude}
				anchor="bottom"
				onClick={(e) => {
					e.originalEvent.stopPropagation()
					setIsOpen(true)
				}}
			>
				<MarkerIcon />
			</MapMarker>
		</>
	)
}

export default Marker
