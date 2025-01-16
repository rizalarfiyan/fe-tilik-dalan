import type { BaseResponse } from '@/types/api'
import useAxios from '@hooks/use-axios'
import * as React from 'react'
import type { MapRef } from 'react-map-gl'
import type { IMapsContext } from '@/types/maps'
import type { CCTV } from '@/types/cctv'

export const MapsContext = React.createContext<IMapsContext | null>(null)

const deactivateMarker = () => {
	const activeMarker = document.querySelectorAll('svg[data-active="true"]')
	for (const marker of activeMarker) {
		marker.setAttribute('data-active', 'false')
	}
}

const activeMarker = (id: string) => {
	deactivateMarker()
	const marker = document.querySelector(`svg[data-marker-id="${id}"]`)
	marker?.setAttribute('data-active', 'true')
}

const MapsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const api = useAxios<BaseResponse<IMapsContext['cctv']>>('/cctv')
	const mapRef = React.useRef<MapRef>(null)
	const [active, setActive] = React.useState<CCTV | null>(null)

	const state = React.useMemo(() => {
		const { res, ...rest } = api
		return {
			cctv: res?.data ?? [],
			...rest,
		}
	}, [api])

	const value = React.useMemo(() => {
		return {
			mapRef,
			active,
			setActive: (cctv: CCTV) => {
				activeMarker(cctv.id)
				setActive(cctv)
				mapRef.current?.flyTo({
					center: [cctv.longitude, cctv.latitude],
					zoom: 17,
					duration: 2000,
				})
			},
			deactivate: () => {
				deactivateMarker()
				setActive(null)
			},
			...state,
		}
	}, [active, state])

	return <MapsContext.Provider value={value}>{children}</MapsContext.Provider>
}

export default MapsProvider
