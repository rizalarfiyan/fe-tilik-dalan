import Marker from '@components/maps/marker'
import { MAP_BOX_API_KEY } from '@constants'
import useMaps from '@hooks/use-maps'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as React from 'react'
import ReactMapGl, { NavigationControl, ScaleControl } from 'react-map-gl'
import ListCCTV from './list-cctv'

function Page() {
	const { cctv, mapRef } = useMaps()

	const marker = React.useMemo(() => {
		return cctv.map((val) => {
			return <Marker key={val.id} {...val} />
		})
	}, [cctv])

	return (
		<div className="flex h-full min-h-screen w-full">
			<div className="w-full max-w-sm overflow-hidden">
				<ListCCTV />
			</div>
			<div className="relative w-full">
				<div className="absolute top-4 left-4 z-10 border border-red-500">
					Information Detail
				</div>
				<ReactMapGl
					ref={mapRef}
					initialViewState={{
						latitude: -7.8,
						longitude: 110.37,
						zoom: 13,
					}}
					mapStyle="mapbox://styles/mapbox/streets-v12"
					mapboxAccessToken={MAP_BOX_API_KEY}
				>
					<ScaleControl position="bottom-right" />
					<NavigationControl position="bottom-right" />
					{marker}
				</ReactMapGl>
			</div>
		</div>
	)
}

export default Page
