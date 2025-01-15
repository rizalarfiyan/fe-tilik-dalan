import HlsPlayer from '@components/hls-player'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog'
import { createLazyFileRoute } from '@tanstack/react-router'
import type { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMemo, useRef, useState } from 'react'
import { MapContainer } from 'react-leaflet/MapContainer'
import { Marker } from 'react-leaflet/Marker'
import { TileLayer } from 'react-leaflet/TileLayer'
import data from './data.json'

export const Route = createLazyFileRoute('/dashboard/')({
	component: RouteComponent,
})

interface DataJson {
	id: string
	title: string
	link: string
	latitude: number
	longitude: number
}

function MapMarker({ latitude, longitude, title, link }: DataJson) {
	const [isOpen, setIsOpen] = useState(false)

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
			<Marker
				position={[latitude, longitude]}
				eventHandlers={{
					click: (e) => {
						console.log(e, title)
						e.originalEvent.stopPropagation()
						setIsOpen(true)
					},
				}}
			/>
		</>
	)
}

function RouteComponent() {
	const marker = useMemo(() => {
		return data.map((val: DataJson) => {
			return <MapMarker key={val.id} {...val} />
		})
	}, [])

	const mapRef = useRef<LeafletMap>(null)

	return (
		<div className="relative">
			<div className='fixed top-0 right-0 z-[1000] bg-white p-2'>
				<button type='button' onClick={() => mapRef.current!.flyTo([-7.8, 110.4], 11.5)}>
					Reset Map
				</button>
				<button type='button' onClick={() => mapRef.current!.flyTo([-7.7226, 110.3892], 18)}>
					Sungai Ngentak
				</button>
			</div>
			<MapContainer
				center={[-7.8, 110.4]}
				zoom={11.5}
				className="h-screen w-screen"
				ref={mapRef}
			>
				{/* <MapController /> */}
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
					subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
				/>
				{marker}
			</MapContainer>
		</div>
	)
}
