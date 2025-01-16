import * as React from 'react'
import type { MapRef } from 'react-map-gl'
import type { IMapsContext, IMapsMove } from '@/types/maps'
import { DEFAULT_MAP, DEFAULT_ZOOM_MARKER } from '@constants'
import useDashboard from '@hooks/use-dashboard'
import { Button } from '@components/ui/button'
import { MapPin, Pin } from 'lucide-react'

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
	const { active, setAction } = useDashboard()
	const mapRef = React.useRef<MapRef>(null)

	// TODO: this code is make duplicate render
	React.useEffect(() => {
		setAction(
			<Button
				variant="outline"
				type="button"
				size="icon"
				className="flex-shrink-0"
				onClick={onReset}
			>
				{active ? <Pin /> : <MapPin />}
			</Button>,
		)
	}, [active, setAction])

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

	const onReset = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		movePosition()
	}

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
