import type { CCTV } from '@/types/cctv'
import useMaps from '@hooks/use-maps'
import type React from 'react'
import { Marker as MapMarker } from 'react-map-gl'
import MarkerIcon from './marker-icon'

const Marker: React.FC<CCTV> = (cctv) => {
	const { setActive } = useMaps()
	const { id, latitude, longitude } = cctv
	return (
		<MapMarker
			longitude={longitude}
			latitude={latitude}
			anchor="bottom"
			onClick={(e) => {
				e.originalEvent.stopPropagation()
				setActive(cctv)
			}}
		>
			<MarkerIcon data-marker-id={id} data-active="false" />
		</MapMarker>
	)
}

export default Marker
