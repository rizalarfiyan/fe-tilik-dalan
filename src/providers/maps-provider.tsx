import type { BaseResponse } from '@/types/api'
import useAxios from '@hooks/use-axios'
import * as React from 'react'
import type { MapRef } from 'react-map-gl'
import type { IMapsContext, IMapsMove } from '@/types/maps'
import type { CCTV } from '@/types/cctv'
import { DEFAULT_MAP, DEFAULT_ZOOM_MARKER } from '@constants'

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

	const movePosition = React.useCallback(
		(move?: IMapsMove) => {
			const movement = ({
				latitude,
				longitude,
				zoom = DEFAULT_ZOOM_MARKER,
			}: IMapsMove) => {
				mapRef.current?.flyTo({
					center: [longitude, latitude],
					zoom,
					duration: 2000,
				})
			}

			console.log(move, active)

			if (move) {
				movement(move)
				return
			}

			if (active) {
				movement({
					...active,
				})
				return
			}

			movement(DEFAULT_MAP)
		},
		[active],
	)

	const value = React.useMemo(() => {
		return {
			mapRef,
			active,
			setActive: (cctv: CCTV) => {
				activeMarker(cctv.id)
				setActive(cctv)
				movePosition(cctv)
			},
			deactivate: () => {
				deactivateMarker()
				setActive(null)
			},
			movePosition,
			...state,
		}
	}, [active, movePosition, state])

	return <MapsContext.Provider value={value}>{children}</MapsContext.Provider>
}

export default MapsProvider
