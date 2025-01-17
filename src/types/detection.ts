import type Yolo from '@lib/yolo'

export interface IDetectionContext {
	model: Yolo | null
	setModel: (model: Yolo | null) => void
}
