import { useContext } from 'react'
import type { IMapsContext } from '@/types/maps'
import { MapsContext } from '@providers/maps-provider'

export const useMaps = (): IMapsContext => {
	const context = useContext(MapsContext)
	if (!context) {
		throw new Error('useMaps must be used within a MapsProvider')
	}
	return context
}

export default useMaps
