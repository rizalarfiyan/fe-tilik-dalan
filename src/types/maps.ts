import type React from 'react'
import type { CCTV } from './cctv'
import type { MapRef } from 'react-map-gl'

export interface IMapsContext {
	cctv: CCTV[]
	active: CCTV | null
	mapRef: React.RefObject<MapRef | null>
	isLoading: boolean
	isError: boolean
	error?: string | null
	setActive: (cctv: CCTV) => void
	deactivate: () => void
}
