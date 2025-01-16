import { createLazyFileRoute } from '@tanstack/react-router'
import Page from './-component/page'

export const Route = createLazyFileRoute('/dashboard/')({
	component: Page,
})
