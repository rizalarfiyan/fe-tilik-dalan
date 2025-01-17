import { createLazyFileRoute } from '@tanstack/react-router'
import Detection from './-component/detection'

export const Route = createLazyFileRoute('/dashboard/detection')({
	component: Detection,
})
