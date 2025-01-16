import type React from 'react'
import type { MapRef } from 'react-map-gl'

export interface IMapsContext {
	mapRef: React.RefObject<MapRef | null>
	movePosition: (move?: IMapsMove) => void
}

export interface IMapsMove {
	longitude: number
	latitude: number
	zoom?: number
}
