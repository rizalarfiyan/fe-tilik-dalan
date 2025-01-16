import Marker from '@/routes/dashboard/-component/marker'
import { MAP_BOX_API_KEY } from '@constants'
import useDashboard from '@hooks/use-dashboard'
import useMaps from '@hooks/use-maps'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as React from 'react'
import ReactMapGl, { NavigationControl, ScaleControl } from 'react-map-gl'
import Detail from './detail'

function Page() {
	const { cctv } = useDashboard()
	const { mapRef } = useMaps()

	const marker = React.useMemo(() => {
		return cctv.map((val) => {
			return <Marker key={val.id} {...val} />
		})
	}, [cctv])

	return (
		<div className="flex h-full min-h-screen w-full">
			<Detail />
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
	)
}

export default Page
