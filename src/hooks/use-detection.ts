import { useContext } from 'react'
import type { IDetectionContext } from '@/types/detection'
import { DetectionContext } from '@providers/detection-provider'

export const useDetection = (): IDetectionContext => {
	const context = useContext(DetectionContext)
	if (!context) {
		throw new Error('useDetection must be used within a DetectionProvider')
	}
	return context
}

export default useDetection
