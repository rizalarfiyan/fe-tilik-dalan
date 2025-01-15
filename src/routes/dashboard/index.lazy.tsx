import { createLazyFileRoute } from '@tanstack/react-router'
import { Marker } from 'react-leaflet/Marker'
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Popup } from 'react-leaflet/Popup'
import 'leaflet/dist/leaflet.css'
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

function RouteComponent() {
	return (
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
			{data.map(({ id, latitude, longitude, title }: DataJson) => {
				return (
					<Marker key={id} position={[latitude, longitude]}>
						<Popup>{title}</Popup>
					</Marker>
				)
			})}
		</MapContainer>
	)
}
