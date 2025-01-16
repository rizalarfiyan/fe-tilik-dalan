import { API_BASE_URL, MAP_BOX_API_KEY } from '@constants'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as React from 'react'
import ReactMapGl, {
	type MapRef,
	NavigationControl,
	ScaleControl,
} from 'react-map-gl'
import Marker from '@components/maps/marker'
import type { CCTV } from '@/types/cctv'
import useAxios from '@hooks/use-axios'
import type { BaseResponse } from '@/types/api'

function Page() {
	const { res } = useAxios<BaseResponse<CCTV[]>>('/cctv')
	const mapRef = React.useRef<MapRef>(null)

	const marker = React.useMemo(() => {
		return (res?.data ?? []).map((val) => {
			return <Marker key={val.id} {...val} />
		})
	}, [res])

	const onClick = ({ latitude, longitude }: CCTV) => {
		return (e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			mapRef.current?.flyTo({
				center: [longitude, latitude],
				zoom: 17,
				duration: 2000,
			})
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: onClick is a function that will be called when the button is clicked
	const lists = React.useMemo(() => {
		return (res?.data ?? []).map((val) => {
			return (
				<div
					key={val.id}
					className="flex w-full items-center justify-between overflow-hidden p-2"
				>
					<img
						src={API_BASE_URL + val.image}
						className="w-20 object-cover"
						crossOrigin="anonymous"
						alt={val.title}
					/>
					<div>{val.title}</div>
					<button type="button" onClick={onClick(val)}>
						View
					</button>
				</div>
			)
		})
	}, [res])

	return (
		<div className="relative">
			<div className="flex h-full min-h-screen w-full">
				<div className="w-full max-w-sm overflow-hidden">
					<div className="max-h-screen divide-y divide-gray-300 overflow-auto p-2">
						{lists}
					</div>
				</div>
				<div className="w-full">
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
						<NavigationControl position="top-left" />
						<ScaleControl />
						{marker}
					</ReactMapGl>
				</div>
			</div>
		</div>
	)
}

export default Page
