import type { BaseResponse } from '@/types/api'
import type { CCTV } from '@/types/cctv'
import Marker from '@components/maps/marker'
import { MAP_BOX_API_KEY } from '@constants'
import useAxios from '@hooks/use-axios'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as React from 'react'
import ReactMapGl, {
	type MapRef,
	NavigationControl,
	ScaleControl,
} from 'react-map-gl'
import ListCCTV from './list-cctv'

function Page() {
	const { res } = useAxios<BaseResponse<CCTV[]>>('/cctv')
	const mapRef = React.useRef<MapRef>(null)

	const { cctv, marker } = React.useMemo(() => {
		const cctv = res?.data ?? []
		const marker = cctv.map((val) => {
			return <Marker key={val.id} {...val} />
		})
		return {
			marker,
			cctv,
		}
	}, [res])

	return (
		<div className="flex h-full min-h-screen w-full">
			<div className="w-full max-w-sm overflow-hidden">
				<ListCCTV mapRef={mapRef} cctv={cctv} />
			</div>
			<div className="relative w-full">
				<div className="absolute top-4 left-4 z-10 border border-red-500">
					woke
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
