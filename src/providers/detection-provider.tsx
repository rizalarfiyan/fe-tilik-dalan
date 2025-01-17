import type { IDetectionContext } from '@/types/detection'
import type Yolo from '@lib/yolo'
import * as React from 'react'

export const DetectionContext = React.createContext<IDetectionContext | null>(
	null,
)

const DetectionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [model, setModel] = React.useState<Yolo | null>(null)

	const value = React.useMemo((): IDetectionContext => {
		return {
			model,
			setModel,
		}
	}, [model])

	return (
		<DetectionContext.Provider value={value}>
			{children}
		</DetectionContext.Provider>
	)
}

export default DetectionProvider
