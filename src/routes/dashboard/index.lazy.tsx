import { createLazyFileRoute } from '@tanstack/react-router'
import { Marker } from 'react-leaflet/Marker'
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMemo, useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog'

import data from './data.json'
import 'leaflet/dist/leaflet.css'

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

function MapMarker({ latitude, longitude, title }: DataJson) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle className="text-center">{title}</DialogTitle>
					</DialogHeader>
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

	return (
		<div className="relative">
			<MapContainer
				center={[-7.8, 110.4]}
				zoom={11.5}
				className="h-screen w-screen"
			>
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
