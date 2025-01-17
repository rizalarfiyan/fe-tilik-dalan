import type { IMapsContext, IMapsMove } from '@/types/maps'
import { DEFAULT_MAP, DEFAULT_ZOOM_MARKER } from '@constants'
import useDashboard from '@hooks/use-dashboard'
import useOnce from '@hooks/use-once'
import * as React from 'react'
import type { MapRef } from 'react-map-gl'

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
	const { active, setPage } = useDashboard()
	const mapRef = React.useRef<MapRef>(null)

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

	useOnce(() => {
		setPage({
			isLoading: false,
			moveMap: movePosition,
		})
	})

	React.useEffect(() => {
		if (!active) {
			deactivateMarker()
			movePosition(DEFAULT_MAP)
			return
		}
		activeMarker(active.id)
		movePosition(active)
	}, [active, movePosition])

	const value = React.useMemo(() => {
		return {
			mapRef,
			movePosition,
		}
	}, [movePosition])

	return <MapsContext.Provider value={value}>{children}</MapsContext.Provider>
}

export default React.memo(MapsProvider)
