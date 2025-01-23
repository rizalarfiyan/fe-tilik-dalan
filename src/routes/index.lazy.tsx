import { createLazyFileRoute } from '@tanstack/react-router'
import Page from './-components'

export const Route = createLazyFileRoute('/')({
	component: Page,
})
