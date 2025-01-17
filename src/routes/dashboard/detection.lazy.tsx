import { createLazyFileRoute } from '@tanstack/react-router'
import Detection from './-component/detection'
import DetectionProvider from '@providers/detection-provider'

export const Route = createLazyFileRoute('/dashboard/detection')({
	component: () => {
		return (
			<DetectionProvider>
				<Detection />
			</DetectionProvider>
		)
	},
})
